package com.email.service.impl;


import com.common.service.dtos.ResponseDTO;
import com.email.client.dtos.NotificationDTO;
import com.email.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {


    @Autowired
    private JavaMailSender mailSender;

    @Override
    public ResponseDTO sendEmailWithAttachment(NotificationDTO notificationDTO) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(notificationDTO.getFrom());
        helper.setTo(notificationDTO.getTo());
        helper.setSubject(notificationDTO.getSubject());
        if(notificationDTO.isHtml()){
            helper.setText(notificationDTO.getMessage(), true);
        } else {
            helper.setText(notificationDTO.getMessage());
        }

        if (notificationDTO.getCc() != null && !notificationDTO.getCc().trim().isEmpty()) {
            helper.setCc(notificationDTO.getCc().split(","));
        }

        if (notificationDTO.getBcc() != null && !notificationDTO.getBcc().trim().isEmpty()) {
            helper.setBcc(notificationDTO.getBcc().split(","));
        }

        /*// Attach file
        FileSystemResource file = new FileSystemResource(new File("C:/file/test.pdf"));
        helper.addAttachment("test.pdf", file);*/

        mailSender.send(message);

        return new ResponseDTO(true, null, "Message sent successfully to " + notificationDTO.getTo());
    }

}
