package com.security.controller;

import com.security.client.dtos.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.service.dtos.LoginRequest;
import com.security.service.SecurityService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class SecurityController {

    @Autowired
    private SecurityService securityService;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        return securityService.loginUser(loginRequest, httpServletResponse);
    }

    @PostMapping(value = "/generate-new-token", consumes = MediaType.APPLICATION_JSON_VALUE)
    public LoginResponse generateNewAccessAndRefreshToken(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        return null;
    }

    @GetMapping("/test")
    public String test() {
        return "pass";
    }
}
