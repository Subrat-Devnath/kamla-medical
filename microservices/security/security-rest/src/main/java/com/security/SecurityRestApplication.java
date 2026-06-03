package com.security;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = {"com.security", "com.user.mgmt.client"})
@EnableEurekaClient
public class SecurityRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityRestApplication.class, args);
    }

}
