package com.pli233.CS639Backend.mapper;

import com.pli233.CS639Backend.entity.Quest;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * This is the mapper DAO (Data Access Object) class QuestMapper
 * that interacts with the database table quest.
 *
 * Author: pli233
 * Version: 1.00
 * Date: 2023.7.19
 */
@Mapper
public interface QuestMapper {

    @Results({
            @Result(property = "interpretedContent", column = "interpreted_content"),
            @Result(property = "createdDate", column = "created_date"),
            @Result(property = "createdBy", column = "created_by"),
            @Result(property = "updatedDate", column = "updated_date"),
            @Result(property = "updatedBy", column = "updated_by")
    })

    @Insert("INSERT INTO quest (status, content, interpreted_content, created_date, created_by, updated_date, updated_by)\n" +
            "VALUES (#{status}, #{content}, #{interpretedContent}, now(), #{createdBy}, now(), #{updatedBy})")
    int insertQuest(Quest quest);

    @Delete("DELETE FROM quest WHERE id = #{id}")
    int deleteQuestById(String id);

    @Select("SELECT * FROM quest WHERE id = #{id}")
    Quest selectQuestById(String id);

    @Select("SELECT id FROM quest")
    List<String> selectAllQuestIds();

    @Update("UPDATE quest SET status = #{status}, interpreted_content = #{interpretedContent} WHERE id = #{id}")
    int updateQuestStatusAndInterpretedContentById(@Param("id") String id, @Param("status") Integer status, @Param("interpretedContent") String interpretedContent);

    @Update("UPDATE quest SET interpreted_content = #{interpretedContent} WHERE id = #{id}")
    int updateQuestInterpretedContentById(@Param("id") String id, @Param("interpretedContent") String interpretedContent);

    @Update("TRUNCATE TABLE quest")
    int truncateQuest();
}
