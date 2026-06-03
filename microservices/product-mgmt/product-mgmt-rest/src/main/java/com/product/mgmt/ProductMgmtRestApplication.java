package com.product.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = {"com.product.mgmt", "com.security.config"})
@EnableEurekaClient
@EnableJpaRepositories(basePackages = {"com.product.mgmt.repository.dao"})
@EntityScan(basePackages = {"com.product.mgmt.repository.entity"})
public class ProductMgmtRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductMgmtRestApplication.class, args);
    }

}
