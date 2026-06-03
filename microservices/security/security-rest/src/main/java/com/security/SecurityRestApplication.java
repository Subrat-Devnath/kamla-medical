package com.security;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = {"com.security", "com.user.mgmt.client"})
@EnableEurekaClient
@EnableJpaRepositories(basePackages = {"com.security.repository.dao"})
@EntityScan(basePackages = {"com.security.repository.entity"})
public class SecurityRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityRestApplication.class, args);
    }

}
