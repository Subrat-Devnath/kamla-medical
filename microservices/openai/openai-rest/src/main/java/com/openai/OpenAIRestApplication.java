package com.openai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {"com.openai", "com.security.config"})
@EnableFeignClients(basePackages = {"com.product.mgmt.client", "com.email.client"})
public class OpenAIRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpenAIRestApplication.class, args);
    }

}
