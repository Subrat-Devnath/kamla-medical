package com.security.client.dtos;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginResponse implements Serializable {

    private String accessToken;

    private String refreshToken;
}
