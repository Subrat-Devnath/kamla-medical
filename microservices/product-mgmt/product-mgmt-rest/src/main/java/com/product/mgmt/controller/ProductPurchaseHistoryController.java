package com.product.mgmt.controller;


import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.service.ProductPurchaseHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductPurchaseHistoryController {

    @Autowired
    private ProductPurchaseHistoryService productPurchaseHistoryService;

    @PostMapping(path = "/purchase-history/{productName}")
    public DataWithPaginationResponse getProductPurchaseHistory(@PathVariable(name = "productName") String productName, @RequestBody PaginationCriteria paginationCriteria) {
        return productPurchaseHistoryService.getProductPurchaseHistory(productName, paginationCriteria);
    }

}
