package com.security.client.configuration;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EntityScan(basePackages = "com.user.mgmt.repository")
@ComponentScan(basePackages = "com.user.mgmt")
public class BeanCreaions {
}
