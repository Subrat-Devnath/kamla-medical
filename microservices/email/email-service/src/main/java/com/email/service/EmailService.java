package com.email.service;


import com.common.service.dtos.ResponseDTO;
import com.email.client.dtos.NotificationDTO;

public interface EmailService {

    ResponseDTO sendEmailWithAttachment(NotificationDTO notificationDTO) throws Exception;
}
