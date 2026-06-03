package com.email.client.dtos;

import lombok.Data;

import java.io.Serializable;

@Data
public class NotificationDTO implements Serializable {

    private String from;
    private String to;
    private String subject;
    private String message;

    private String cc;
    private String bcc;

    private boolean isHtml;
}
