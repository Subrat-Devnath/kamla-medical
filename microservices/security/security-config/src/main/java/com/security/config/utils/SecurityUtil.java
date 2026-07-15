package com.security.config.utils;

import com.common.service.dtos.BaseDTO;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.security.client.dtos.SourceIdentity;
import com.security.client.dtos.UserDetails;
import io.jsonwebtoken.Claims;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

public class SecurityUtil {

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


    public static SourceIdentity getSecuredIdentity(Claims claims) {

        ObjectMapper objectMapper = new ObjectMapper();
        // Ignore any fields in the claims that are not present in SourceIdentity class
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        return objectMapper.convertValue(claims, SourceIdentity.class);
    }

    public static SourceIdentity getPrincipal() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (SourceIdentity) principal;
    }

    public static String getCurrentUserName() {
        String userName = null;

        try {
            if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null && SecurityContextHolder.getContext().getAuthentication().getPrincipal() != null) {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof UserDetails) {
                    userName = ((UserDetails) principal).getUserName();
                }
            }
        } catch (Exception e) {
            //logger.error("SPRING CONTEXT FOR USER IS NOT YET SET", e);
        }
        return userName;
    }
}
