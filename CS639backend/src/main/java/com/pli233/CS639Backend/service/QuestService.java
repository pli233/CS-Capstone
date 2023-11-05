package com.pli233.CS639Backend.service;

import com.pli233.CS639Backend.entity.Quest;

/**
 * The QuestService interface provides methods to manage Quest entities.
 *
 * Author: pli233
 * Version: 1.00
 * Date: 2023.7.19
 */
public interface QuestService {


    void initBloomFilter();

    /**
     * Inserts a Quest entity into the database.
     *
     * @param quest The Quest entity to be inserted.
     * @return The number of rows affected by the insertion.
     */
    int insertQuest(Quest quest);

    /**
     * Deletes a Quest entity from the database based on the specified ID.
     *
     * @param id The ID of the Quest to be deleted.
     * @return The number of rows affected by the deletion (0 or 1).
     */
    int deleteQuestById(String id);

    /**
     * Updates a Quest entity in the database based on the specified ID.
     *
     * @param id    The ID of the Quest to be updated.
     * @param quest The updated Quest entity.
     * @return The number of rows affected by the update (0 or 1).
     */
    int updateQuest(String questId, String interpretedContent);

    /**
     * Retrieves a Quest entity from the database based on the specified ID.
     *
     * @param id The ID of the Quest to be retrieved.
     * @return The Quest entity corresponding to the specified ID, or null if not found.
     */
    Quest getQuestById(String id);

    int truncateQuest();
}
