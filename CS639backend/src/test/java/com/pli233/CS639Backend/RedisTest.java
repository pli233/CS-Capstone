package com.pli233.CS639Backend;

import com.pli233.CS639Backend.config.RedisConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = RedisConfig.class)
@SpringBootTest
public class RedisTest {
    @Autowired
    RedisTemplate redisTemplate;
    @Test
    public void testKeyTypeOperation(){
        //String 类型
        ValueOperations valueOperations = redisTemplate.opsForValue();
        valueOperations.set("test1","李培源");
        System.out.println(valueOperations.get("test1"));
    }
}
