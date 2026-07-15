package com.security.service.impl;

import com.common.service.dtos.LoginRequest;
import com.security.client.dtos.LoginResponse;
import com.security.config.service.JwtService;
import com.security.config.service.impl.CookieServiceImpl;
import com.security.repository.RefreshTokenRepository;
import com.security.repository.entity.RefreshTokenEntity;
import com.security.service.SecurityService;
import com.user.mgmt.client.UserClient;
import com.user.mgmt.client.dtos.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.util.UUID;

@Service
public class SecurityServiceImpl implements SecurityService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private CookieServiceImpl cookieService;

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest, HttpServletResponse httpServletResponse) {

        // Return the access token and refresh token to the client
        LoginResponse loginResponse = new LoginResponse();

        if (loginRequest == null || !StringUtils.hasText(loginRequest.getUserName()) || !StringUtils.hasText(loginRequest.getPassword())) {
            return loginResponse;
        }

        // Validate user credentials and get user details from user service
        UserDTO userDTO = userClient.validateUserAndGet(loginRequest);

        if (userDTO == null) {
            return loginResponse;
        }

        UUID jwtId = UUID.randomUUID();

        String accessToken = jwtService.generateAccessToken(userDTO);
        String refreshToken = jwtService.generateRefereshToken(userDTO, jwtId.toString());

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder().tokenId(jwtId).userId(userDTO.getId()).createdAt(Instant.now().getNano()).expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()).getNano()).revoked(false).replacedToken(refreshToken).build();

        // Store refresh token details in the database
        refreshTokenRepository.saveRefreshToken(refreshTokenEntity);

        cookieService.attachAccessTokenToCookie(httpServletResponse, accessToken, (int) jwtService.getAccessTtlSeconds());
        cookieService.attachRefreshTokenToCookie(httpServletResponse, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoHeaderForCookie(httpServletResponse);

        loginResponse.setAccessToken(accessToken);
        loginResponse.setRefreshToken(refreshToken);

        return loginResponse;
    }

}
