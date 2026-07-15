package com.common.service.utils;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CommonUtils {

    public static int getPageNumber(String pageState) {

        if (!StringUtils.hasLength(pageState)) {
            return 0;
        }

        try {
            return Integer.parseInt(pageState);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
