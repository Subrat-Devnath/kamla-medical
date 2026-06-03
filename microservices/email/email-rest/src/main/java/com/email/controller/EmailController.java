package com.email.controller;

import com.common.service.dtos.ResponseDTO;
import com.email.client.dtos.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.service.EmailService;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/send-email", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseDTO sendEmailWithAttachment(@RequestBody NotificationDTO notificationDTO) throws Exception {
       return emailService.sendEmailWithAttachment(notificationDTO);
    }
}
