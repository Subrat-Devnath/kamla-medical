package com.security.service;

import com.common.service.dtos.LoginRequest;
import com.security.client.dtos.LoginResponse;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public interface SecurityService {

    LoginResponse loginUser(LoginRequest userDetails,  HttpServletResponse httpServletResponse);

}
