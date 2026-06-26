package com.common.service.utils;

import com.common.service.dtos.BaseDTO;
import com.security.config.utils.SecurityUtil;
import org.springframework.stereotype.Component;

@Component
public class CommonUtils {

    public static void setCreationDetails(BaseDTO baseDTO) {

        if (baseDTO.getCreatedUserId() == null) {
            baseDTO.setCreatedUserId(SecurityUtil.getPrincipal().getUserId());
        }

        if (baseDTO.getCreatedUserName() == null) {
            baseDTO.setCreatedUserName(SecurityUtil.getPrincipal().getUserName());
        }

        if (baseDTO.getCreatedDate() == null) {
            baseDTO.setCreatedDate(System.currentTimeMillis());
        }

        baseDTO.setUpdatedUserId(SecurityUtil.getPrincipal().getUserId());
        baseDTO.setUpdatedUserName(SecurityUtil.getPrincipal().getUserName());
        baseDTO.setUpdatedDate(System.currentTimeMillis());
    }
}
