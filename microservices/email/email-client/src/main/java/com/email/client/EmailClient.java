package com.email.client;

import com.common.service.dtos.ResponseDTO;
import com.email.client.dtos.NotificationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@FeignClient(contextId = "emailClient", name = "email", url = "${email.url}", path = "${email.contextPath}")
public interface EmailClient {

    @PostMapping(value = "/api/v1/send-email", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseDTO sendEmailWithAttachment(@RequestBody NotificationDTO notificationDTO) throws Exception;


}
