package com.product.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication(scanBasePackages = {"com.product.mgmt", "com.security.config"})
@EnableEurekaClient
public class ProductMgmtRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductMgmtRestApplication.class, args);
    }

}
