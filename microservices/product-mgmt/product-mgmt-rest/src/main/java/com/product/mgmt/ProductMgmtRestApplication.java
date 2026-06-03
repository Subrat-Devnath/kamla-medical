package com.product.mgmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;

@SpringBootApplication(scanBasePackages = {"com.product.mgmt", "com.security.config"})
@EnableEurekaClient
@EnableCassandraRepositories(basePackages = "com.product.mgmt.repository.dao")
public class ProductMgmtRestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductMgmtRestApplication.class, args);
    }

}
