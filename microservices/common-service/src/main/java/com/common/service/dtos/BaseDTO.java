package com.common.service.dtos;

import lombok.Data;

@Data
public class BaseDTO {

    private boolean isDeleted;

    private Long expiryDate;

    private boolean isExpired;

    private Long createdDate;

    private String createdUserId;

    private String createdUserName;

    private Long updatedDate;

    private String updatedUserId;

    private String updatedUserName;

}
