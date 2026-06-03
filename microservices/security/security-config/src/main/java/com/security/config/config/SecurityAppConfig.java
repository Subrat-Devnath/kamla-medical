package com.security.config.config;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableFeignClients(basePackages = { "com.user.mgmt.client" })
public class SecurityAppConfig {

}
