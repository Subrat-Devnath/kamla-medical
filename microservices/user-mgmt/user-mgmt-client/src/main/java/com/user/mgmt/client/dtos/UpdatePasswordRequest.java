package com.user.mgmt.client.dtos;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String emailId;
    private String oldPassword;
    private String newPassword;
}

