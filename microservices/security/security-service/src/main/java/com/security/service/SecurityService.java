package com.security.service;

import com.common.service.dtos.LoginRequest;
import com.security.client.dtos.LoginResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface SecurityService {

    LoginResponse loginUser(LoginRequest userDetails,  HttpServletResponse httpServletResponse);

}
