package com.pli233.CS639Backend.entity;

import lombok.Data;

import java.io.Serializable;


/**
 * Quest is an entity class, represent data in the table quest_rule
 *
 * @Data annotation is from the Lombok library, which automatically generates getter and setter methods,
 * toString(), equals(), and hashCode() methods, reducing boilerplate code.
 *
 * Author: pli233
 * Version: 1.00
 * Date: 2023.7.19
 */


@Data
public class Quest implements Serializable {

    //用户id，主键
    //id: Represents the quest ID, serving as the primary key
    private String id;

    //状态码 0还没解释 1解释了
    //status: Represents the status code, with values 0 (not interpreted) and 1 (interpreted)
    private Integer status;

    //内容
    private String content;

    //翻译后内容
    private String interpretedContent;


    //创建时间
    //createdDate: Represents the creation date
    //It will always be time we accept an input, other than manually enter it
    private String createdDate;

    //创建人
    //createdBy: Represents the creator
    private String createdBy;

    //更新时间
    //updatedDate: Represents the update date
    //It will always be time we accept an input, other than manually enter it
    private String updatedDate;

    //更新人
    //updatedBy: Represents the person who last updated the entity
    private String updatedBy;
}
