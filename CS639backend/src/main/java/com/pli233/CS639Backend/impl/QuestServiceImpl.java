package com.pli233.CS639Backend.impl;

import com.google.common.hash.BloomFilter;
import com.pli233.CS639Backend.entity.Quest;
import com.pli233.CS639Backend.mapper.QuestMapper;
import com.pli233.CS639Backend.service.QuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.concurrent.TimeUnit;


/**
 * The QuestServiceImpl class provides the implementation for managing Quest entities.
 * <p>
 * Author: pli233
 * Version: 1.00
 * Date: 2023.7.19
 */
@Service
public class QuestServiceImpl implements QuestService {
    @Autowired
    private QuestMapper questMapper;
    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    @Qualifier("questRuleIdBloom")
    BloomFilter<String> questRuleIdBloom;


    @Override
    @PostConstruct
    public void initBloomFilter() {
        // Fetch IDs from the database using the QuestRuleInstanceMapper
        System.out.println("-------------------------------------");
        System.out.println("::> Initializing Bloom Filter For Quest Id......");
        List<String> allIds = questMapper.selectAllQuestIds();
        System.out.println("::> Successfully Initialized Bloom Filter For Quest Id");
        System.out.println("-------------------------------------");
        // Add IDs to the BloomFilter
        for (String id : allIds) {
            questRuleIdBloom.put(id);
        }
    }


    /**
     * Inserts a Quest entity into the database.
     *
     * @param quest The Quest entity to be inserted.
     * @return The number of rows affected by the insertion.
     */
    @Override
    public int insertQuest(Quest quest) {
        System.out.println("-------------------------------------");
        System.out.println("::> Calling up an insertion for Quest" + quest.toString());
        //1. Insert elements into mysql
        String questId = quest.getId();
        Quest target = questMapper.selectQuestById(questId);
        int result = questMapper.insertQuest(quest);

        //2.If we do insert some value into mysql or the value is existed,
        // we would also want it to store in redis and bloom filter
        if (result == 0) {
            System.out.println("::> Quest has an existed id in Mysql, insertion failed");
        } else {
            System.out.printf("::> Insert %d Quest values into Mysql%n", result);
            ValueOperations<String, Quest> operations = redisTemplate.opsForValue();
            if (questRuleIdBloom.put(questId)) {
                System.out.printf("::> Successfully load %s into Bloom Filter%n", questId);
            }
            String key = "quest_" + questId;
            System.out.println("::> Preparing key for Redis Insertion, Key = " + key);
            boolean hasKey = redisTemplate.hasKey(key);
            //If key is exist, we will delete it and restore the instance
            if (hasKey) {
                redisTemplate.delete(key);
                System.out.printf("::>  Delete Exist Key = %s in Redis%n", key);
            }
            //Insert instance into redis, and it will expire in 3 hours
            if (quest != null) {
                System.out.printf("::>  Load Quest %s from Redis redis%n", questId);
                Quest stored_quest = questMapper.selectQuestById(questId);
                System.out.printf("::>  Insert Quest %s into redis with Key = %s%n", questId, key);
                operations.set(key, stored_quest, 3, TimeUnit.HOURS);
            }
            System.out.printf("::>  Insertion for Quest %s is finished successfully!%n", questId);
            System.out.println("-------------------------------------");
        }
        return result;
    }


    /**
     * Deletes a Quest entity from the database based on the specified ID.
     *
     * @param id The ID of the Quest to be deleted.
     * @return The number of rows affected by the deletion, 0 if nothing is affected.
     */
    @Override
    public int deleteQuestById(String questId) {
        // Create the Redis key for the Quest
        String key = "quest_" + questId;

        // Check if the Quest exists in Redis
        boolean hasKey = redisTemplate.hasKey(key);

        // Delete the Quest from Redis if it exists
        if (hasKey) {
            redisTemplate.delete(key);
        }

        int result = 0;

        // Retrieve the Quest from the database
        Quest target = questMapper.selectQuestById(questId);

        // Delete the Quest from the database if it exists
        if (target != null) {
            result = questMapper.deleteQuestById(questId);
        }

        return result;
    }

    /**
     * Updates the status to 1 and interpretedContent of a Quest entity in the database based on the specified ID.
     *
     * @param questId            The ID of the Quest to be updated.
     * @param interpretedContent The new interpreted content to be set for the Quest.
     * @return The number of rows affected by the update, -1 if the Quest is not found.
     */
    @Override
    public int updateQuest(String questId, String interpretedContent) {
        // Update the Quest status and interpretedContent in the database
        int result = questMapper.updateQuestStatusAndInterpretedContentById(questId, 1, interpretedContent);

        // If the update is successful, update the Redis cache
        if (result != 0) {
            String key = "quest_" + questId;
            boolean hasKey = redisTemplate.hasKey(key);

            // Retrieve the updated Quest from the database
            Quest updatedQuest = questMapper.selectQuestById(questId);

            if (hasKey) {
                // If the key exists in Redis, update the cached Quest
                ValueOperations<String, Quest> operations = redisTemplate.opsForValue();
                operations.set(key, updatedQuest, 3, TimeUnit.HOURS);
            }

            return result;
        }

        return -1;
    }



    /**
     * Retrieves a Quest entity from the database based on the specified ID.
     *
     * @param id The ID of the Quest to be retrieved.
     * @return The Quest entity corresponding to the specified ID, null if nothing is selected.
     */
    @Override
    public Quest getQuestById(String questId) {
        if (questRuleIdBloom.mightContain(questId)) {
            // Create the Redis key for the Quest
            String key = "quest_" + questId;

            // Check if the Quest exists in Redis
            boolean hasKey = redisTemplate.hasKey(key);

            Quest target;

            // Create ValueOperations object to interact with Redis
            ValueOperations<String, Quest> operations = redisTemplate.opsForValue();

            if (hasKey) {
                // Retrieve the Quest from Redis
                target = operations.get(key);
            } else {
                // Retrieve the Quest from the database
                target = questMapper.selectQuestById(questId);

                // Store the Quest in Redis with a TTL (Time To Live) of 3 hours, even with null object
                operations.set(key, target, 3, TimeUnit.HOURS);
            }

            return target;
        }
        System.out.println("Protect By Bloom Filter");
        return null;
    }



    /**
     * Truncates (empties) the quest_rule table in the database.
     * Deletes every existing corresponding data in Redis.
     *
     * @return The number of rows affected by the truncation.
     */
    @Override
    public int truncateQuest() {
        List<String> questIds = questMapper.selectAllQuestIds();

        // Delete corresponding data in Redis for each Quest
        for (String id : questIds) {
            String key = "quest_" + id;
            if (redisTemplate.hasKey(key)) {
                redisTemplate.delete(key);
            }
        }

        // Truncate the quest_rule table in the database
        questMapper.truncateQuest();

        return questIds.size();
    }
}