package com.pli233.CS639Backend.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * redisTemplate封装
 */
@Component
public class RedisUtil {
    @Autowired
    private RedisTemplate<String,Object> redisTemplate;

    public RedisUtil(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 指定缓存失效时间
     * @param key
     * @param time
     * @return
     */
    public boolean expire(String key,long time){
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 指定key过期时间
     * @param key
     * @return
     */
    public long getExpire(String key){
        return redisTemplate.getExpire(key,TimeUnit.SECONDS);
    }

    /**
     * 判断key是否存在
     * @param key
     * @return
     */
    public boolean hasKey(String key){
        try {
            return redisTemplate.hasKey(key);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除缓存
     * @param key
     */
    @SuppressWarnings("unchecked")
    public void del(String ... key){
        if(key!=null&&key.length>0){
            if(key.length==1){
                redisTemplate.delete(key[0]);
            }else {
                redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
            }
        }
    }


    //=====================================================Redis的String数据类型操作=========================================

    /**
     * 普通缓存的获取
     * @param key
     * @return
     */
    public Object get(String key){
        return key==null?null:redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存的存放
     * @param key
     * @param value
     * @return
     */
    public boolean set(String key,Object value){
        try{
            redisTemplate.opsForValue().set(key,value);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 普通缓存放入并设置时间
     * @param key
     * @param value
     * @param time
     * @return
     */
    public boolean set(String key,Object value,long time){
        try{
            if(time>0){
                redisTemplate.opsForValue().set(key,value,time,TimeUnit.SECONDS);
            }else {
                set(key,value);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 递增
     * @param key
     * @param delta
     * @return
     */
    public long incr(String key,long delta){
        if (delta<0){
            throw new RuntimeException("递增的条件必须大于0");
        }
        return redisTemplate.opsForValue().increment(key,delta);
    }


    /**
     * 递减
     * @param key
     * @param delta
     * @return
     */
    public long decr(String key,long delta){
        if (delta<0){
            throw new RuntimeException("递减的条件不许大于0");

        }
        return redisTemplate.opsForValue().decrement(key,-delta);
    }

    //===============================================redis的Hash数据类型操作====================================================

    /**
     * Hashget
     * @param key 不能为null
     * @param itme 不能为null
     * @return
     */
    public Object hget(String key,String itme ){
        return redisTemplate.opsForHash().get(key,itme);
    }

    /**
     * 获取hashkey对应的所有键值
     * @param key
     * @return
     */
    public Map<Object,Object> hmget(String key){
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * HashSet
     */
    public boolean hmset (String key,Map<String,Object> map){
        try {
            redisTemplate.opsForHash().putAll(key,map);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Hashset 设置时间
     * @param key
     * @param map
     * @param time
     * @return
     */
    public boolean hmset(String key,Map<String,Object>map,long time){
        try{
            redisTemplate.opsForHash().putAll(key,map);
            if(time>0){
                expire(key,time);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;

        }

    }

    /**
     * 向一张hash表中放入数据，如果不存在就将其创建
     * @param key
     * @param item 项
     * @param value
     * @return
     */
    public boolean hset(String key,String item,String value){
        try{
            redisTemplate.opsForHash().put(key,item,value);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }

    }

    /**
     * 向一张hash表中放入数据，如果不存在就将其创建,对时间的操作
     * @param key
     * @param item
     * @param value
     * @param time
     * @return
     */
    public boolean hset(String key,String item,String value,long time){
        try{
            redisTemplate.opsForHash().put(key,item,value);
            if (time>0){
                expire(key,time);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }

    }

    /**
     * 删除hash表中的值
     * @param key
     * @param item
     */
    public void hdel(String key,Object ... item){
        redisTemplate.opsForHash().delete(key,item);
    }

    /**
     * 判断Hash表中是否有该项的值
     * @param key
     * @param item
     * @return
     */
    public boolean hHasKey(String key,String item){
        return redisTemplate.opsForHash().hasKey(key,item);
    }

    /**
     * hash递增，如果不存在，就会创建一个，并把新增后的值返回
     * @param key
     * @param item
     * @param by  要增加几（大于0）
     * @return
     */
    public double hincr(String key,String item,double by){
        return redisTemplate.opsForHash().increment(key,item,by);
    }

    /**
     * 递减操作
     * @param key
     * @param item
     * @param by 要减少几（小于0）
     * @return
     */
    public double hdecr(String key,String item,double by){
        return redisTemplate.opsForHash().increment(key,item,by);
    }

    //===============================================redis的set数据类型操作====================================================

    /**
     * 根据key获取set中的所有值
     * @param key
     * @return
     */
    public Set<Object> sGet(String key){
        try {
            return redisTemplate.opsForSet().members(key);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据value从一个set中查询，是否存在
     * @param key
     * @param value
     * @return
     */
    public boolean sHasKey(String key,Object value){
        try {
            return redisTemplate.opsForSet().isMember(key,value);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将数据放入set缓存中
     * @param key
     * @param values
     * @return 成功个数
     */
    public long sSet(String key,Object ... values){
        try{
            return redisTemplate.opsForSet().add(key,values);
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 将set数据放入缓存
     * @param key
     * @param time
     * @param values
     * @return 成功个数
     */
    public long sSetAndTime(String key,long time,Object ... values){
        try{
            Long count = redisTemplate.opsForSet().add(key, values);
            if(time>0){
                expire(key,time);
            }
            return count;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取set缓存的长度
     * @param key
     * @return
     */
    public long sGetSetSize(String key){
        try {
            return redisTemplate.opsForSet().size(key);
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 移除值为value的
     * @param key
     * @param values
     * @return
     */
    public long setRemove(String key,Object ... values){
        try {
            Long count = redisTemplate.opsForSet().remove(key, values);
            return count;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    //===============================================redis的list数据类型操作====================================================

    /**
     * 获取list缓存的内容
     * @param key
     * @param start 开始
     * @param end 结束（0到-1表示所有值）
     * @return
     */
    public List<Object> lGet(String key,long start,long end){
        try {
            return redisTemplate.opsForList().range(key,start,end);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取list缓存的长度
     * @param key
     * @return
     */
    public long lGetListSize(String key){
        try {
            return redisTemplate.opsForList().size(key);
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 通过索引，获取list中的值
     * @param key
     * @param index 索引，index>=0时，0表示开头，1表示第二个元素；index《=0时，-1表示末尾，-2表示第二个元素，
     * @return
     */
    public Object lGetIndex(String key,long index){
        try{
            return redisTemplate.opsForList().index(key,index);
        }catch (Exception e ){
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将list放入缓存
     * @param key
     * @param value
     * @return
     */
    public boolean lSet(String key,Object value){
        try {
            redisTemplate.opsForList().rightPush(key,value);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 将list放入缓存中，对时间操作
     * @param key
     * @param value
     * @param time
     * @return
     */
    public boolean lSet(String key,Object value,long time){
        try {
            redisTemplate.opsForList().rightPush(key,value);
            if (time>0){
                expire(key,time);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     * @param key
     * @param values
     * @return
     */
    public boolean lSetList(String key,List<Object> values){
        try {
            redisTemplate.opsForList().rightPushAll(key,values);
            return true;

        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存中，对时间操作
     * @param key
     * @param values
     * @param time
     * @return
     */
    public boolean lSetList(String key,List<Object> values ,long time){
        try {
            redisTemplate.opsForList().rightPushAll(key,values);
            if(time>=0){
                expire(key,time);
            }
            return true;

        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据索引修改list中的数据
     * @param key
     * @param index
     * @param value
     * @return
     */
    public boolean lUpdateIndex(String key,long index,Object value){
        try {
            redisTemplate.opsForList().set(key,index,value);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 移除n个值
     * @param key
     * @param count
     * @param value
     * @return
     */
    public long lRemove(String key,long count,Object value){
        try{
            return redisTemplate.opsForList().remove(key,count,value);
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }
}

