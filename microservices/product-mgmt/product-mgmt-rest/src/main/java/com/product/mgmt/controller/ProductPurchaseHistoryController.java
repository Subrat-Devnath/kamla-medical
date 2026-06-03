package com.product.mgmt.controller;


import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.service.ProductPurchaseHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductPurchaseHistoryController {

    @Autowired
    private ProductPurchaseHistoryService productPurchaseHistoryService;

    @GetMapping(path = "/purchase-history/{productName}")
    public List<ProductPurchaseHistoryDTO> getProductPurchaseHistory(@PathVariable(name = "productName") String productName) {
        return productPurchaseHistoryService.getProductPurchaseHistory(productName);
    }

}
