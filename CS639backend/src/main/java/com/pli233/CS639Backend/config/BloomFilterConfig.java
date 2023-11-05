package com.pli233.CS639Backend.config;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.nio.charset.Charset;

@Configuration
/**
 * expectedInsertions：期望添加的数据个数
 * fpp：期望的误判率，期望的误判率越低，布隆过滤器计算时间越长
 * @return
 */
public class BloomFilterConfig {


    //Define Bloom Filter for questRuleInstance
    @Bean(name = "questRuleInstanceIdBloom")
    public BloomFilter<String> questRuleInstanceIdBloom(){
        BloomFilter<String> filter = BloomFilter.create(Funnels.stringFunnel(Charset.forName("utf-8")), 1000,0.00001);
        return filter;
    }

    @Bean(name = "questRuleIdBloom")
    public BloomFilter<String> questRuleIdBloom(){
        BloomFilter<String> filter = BloomFilter.create(Funnels.stringFunnel(Charset.forName("utf-8")), 1000,0.00001);
        return filter;
    }
}
