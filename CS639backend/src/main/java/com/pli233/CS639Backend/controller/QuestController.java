package com.pli233.CS639Backend.controller;

import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatMessage;
import com.azure.ai.openai.models.ChatRole;
import com.pli233.CS639Backend.entity.Quest;
import com.pli233.CS639Backend.helper.OpenAIChatService;
import com.pli233.CS639Backend.mapper.QuestMapper;
import com.pli233.CS639Backend.service.QuestService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * The QuestController class is a controller responsible for handling
 * HTTP requests related to QuestRuleInstance entities.
 * <p>
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

    @Autowired
    private OpenAIChatService openAIChatService;


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
        Quest quest = questMapper.selectQuestById(id);
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
        int result = questMapper.insertQuest(quest);
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
        int updatedRows = questMapper.updateQuestInterpretedContentById(questId, newContent);

        if (updatedRows > 0) {
            // If the update was successful, retrieve the updated Quest
            Quest updatedQuest = questMapper.selectQuestById(questId);

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
        return questMapper.truncateQuest();
    }


    @PostMapping("/chat")
    public String sendChatMessage(Quest quest) {
        // Assuming setStatus sets the processing status of the quest,
        // 0 might indicate the quest is being processed.
        quest.setStatus(0);

        // Directly construct the prompt without storing the quest content in a separate string,
        // since it's only used once.
        String prompt = "Analyze the following pathology report and provide the requested information in 3 sections using conventional language, espicially professional medical vocabulary. \n\n" +
                "''' Pathology Report: \n" + quest.getContent() + "\n''' \n\n" +
                "- Provide a one-sentence summary of the key findings from the pathology report, focusing only on the overall diagnosis.\n" +
                "- Noticeable Findings(title): Extract and list all the numerical data and associated medical conditions or findings. \n" +
                "- Medications & Dosage(title):Identify any medications along with their dosages mentioned."+
                "- Omit any sections where information is not mentioned.";

        // Instead of creating a list and adding to it, send the prompt directly
        // if only one message is being processed.
        ChatCompletions completions = openAIChatService.getChatCompletions(Collections.singletonList(new ChatMessage(ChatRole.USER, prompt)));

        // If there is only one choice to be processed, no need for a loop.
        String content = completions.getChoices().isEmpty() ? "" : completions.getChoices().get(0).getMessage().getContent();

        // Update and persist the quest object if needed.
        // quest.setInterpretedContent(content);
        // quest.setStatus(1); // Assuming 1 indicates the quest has been processed.
        // questMapper.insertQuest(quest);

        // Return the content directly.
        return content;
    }


}
