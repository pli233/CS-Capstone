package com.pli233.CS639Backend.helper;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatMessage;
import com.azure.ai.openai.models.ChatRole;
import com.azure.core.credential.KeyCredential;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenAIChatService {

    private final OpenAIClient client;

    @Autowired
    public OpenAIChatService(@Value("${openai.apiKey}") String apiKey) {
        // Initialize the OpenAIClient in the constructor
        this.client = new OpenAIClientBuilder()
                .credential(new KeyCredential(apiKey))
                .buildClient();
    }

    public ChatCompletions getChatCompletions(List<ChatMessage> chatMessages) {
        // Create and return chat completions
        return client.getChatCompletions("gpt-3.5-turbo", new ChatCompletionsOptions(chatMessages));
    }
}
