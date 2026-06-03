package com.email;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {"com.email", "com.security.config"})
@EnableEurekaClient
public class EmailRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmailRestApplication.class, args);
    }

}
