package com.pli233.CS639Backend.controller;

import com.pli233.CS639Backend.entity.Quest;
import com.pli233.CS639Backend.mapper.QuestMapper;
import com.pli233.CS639Backend.service.QuestService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * The QuestController class is a controller responsible for handling
 * HTTP requests related to QuestRuleInstance entities.
 *
 * Author: pli233
 * Version: 1.00
 * Date: 2023.7.19
 */
@RestController
public class QuestController {

    @Autowired
    private RabbitTemplate rabbitTemplate;  // Use RabbitTemplate, which provides methods for receiving/sending messages

    @Autowired
    private QuestService questService;

    @Autowired
    private QuestMapper questMapper;

//    /**
//     * Retrieves all active Quest entities.
//     *
//     * @return A list of active Quest entities.
//     */
//    @PostMapping("/questRuleInstance/selectAll")
//    public List<Quest> selectAllActiveQuestRules() {
//        List<Quest> publishedRules = questService.;
//        return publishedRules;
//    }

    /**
     * Retrieves a QuestRuleInstance entity by its ID.
     *
     * @param id The ID of the QuestRuleInstance to be retrieved.
     * @return A list containing the QuestRuleInstance entity corresponding to the specified ID.
     */
    @PostMapping("/selectById")
    public List<Quest> selectQuestRuleInstanceById(String id) {
        Quest quest= questService.getQuestById(id);
        List<Quest> result = new ArrayList<>();
        result.add(quest);
        return result;
    }

    /**
     * Inserts a QuestRuleInstance entity.
     *
     * @param questRuleInstance The QuestRuleInstance entity to be inserted.
     * @return The number of rows affected by the insertion.
     */
    @PostMapping("/insert")
    public int insertPublishedInstance(Quest quest) {
        int result = questService.insertQuest(quest);
        return result;
    }

    /**
     * Updates the status of QuestRuleInstance entities based on the specified user ID.
     *
     * @param status The new status to be set for the QuestRuleInstance entities.
     * @param userId The user ID.
     * @return The number of rows affected by the update.
     */
    @PostMapping("/update")
    public String updateQuest(@RequestParam("id") String questId, @RequestParam("interpretedContent") String newContent) {
        // Update the Quest entity with the specified status
        int updatedRows = questService.updateQuest(questId, newContent);

        if (updatedRows > 0) {
            // If the update was successful, retrieve the updated Quest
            Quest updatedQuest = questService.getQuestById(questId);

            if (updatedQuest != null) {
                // Use the new interpretedContent in your application
                return updatedQuest.getInterpretedContent();
            }
        }

        // Handle the case when the update fails or the Quest is not found
        // Return an appropriate value or throw an exception
        return ""; // Example fallback value
    }

    /**
     * Truncates (empties) the quest_rule_instance table.
     *
     * @return The number of rows affected by the truncation.
     */
    @PostMapping("/truncate")
    public int truncateQuest() {
        return questService.truncateQuest();
    }
}
