package com.user.mgmt.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.common.service.dtos.LoginRequest;
import com.user.mgmt.client.dtos.UserDTO;

@Service
@FeignClient(contextId = "userClient", name = "user-mgmt", url = "${user.url}", path = "${user.contextPath}")
public interface UserClient {

    @PostMapping(value = "/api/v1/validate/user", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    UserDTO validateUserAndGet(@RequestBody LoginRequest uerDetails);

    @GetMapping(value = "/api/v1/{userName}", produces = MediaType.APPLICATION_JSON_VALUE)
    UserDTO getUserByUserName(@PathVariable String userName) ;
}
