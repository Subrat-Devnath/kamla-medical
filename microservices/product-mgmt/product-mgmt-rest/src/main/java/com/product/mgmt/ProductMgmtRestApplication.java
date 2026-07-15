package com.product.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.product.mgmt", "com.security.config"})
@EnableFeignClients
@EnableJpaRepositories(basePackages = {"com.product.mgmt.repository.dao"})
@EntityScan(basePackages = {"com.product.mgmt.repository.entity"})
public class ProductMgmtRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductMgmtRestApplication.class, args);
    }

}
