package com.pli233.CS639Backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    //Default
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        return rabbitTemplate;
    }

    //Queue and Exchange1 BootMessage, listen to the update information
    // 1. Define Exchange
    @Bean
    public Exchange BootMessageExchange(){
        //enable duality
        return new TopicExchange("MessageTopicExchange", true, false);
    }
    // 2. Define Queues
    @Bean
    public Queue MessageQueue1(){
        //enable duality
        return new Queue("MessageQueue1", true);
    }

    // 3. Bind Queues to Exchange
    @Bean
    public Binding BindMessageQueue1(){
        return BindingBuilder.bind(MessageQueue1()).to(BootMessageExchange()).with("instance.*").noargs();
    }

}
