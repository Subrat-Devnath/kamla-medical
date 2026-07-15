package com.security.controller;

import com.common.service.dtos.LoginRequest;
import com.security.client.dtos.LoginResponse;
import com.security.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

}
