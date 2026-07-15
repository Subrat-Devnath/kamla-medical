package com.user.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.user.mgmt", "com.security.config"})
@EnableFeignClients(basePackages = {"com.product.mgmt.client", "com.email.client"})
@EnableJpaRepositories(basePackages = "com.user.mgmt.repository.dao")
public class UserMgmtRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserMgmtRestApplication.class, args);
    }

}
