package com.product.mgmt.controller;


import ch.qos.logback.core.util.StringUtil;
import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.service.ProductPurchaseHistoryService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
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

    @PostMapping(path = "/purchase-history-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse getProductPurchaseHistoryOrganization(
            @RequestBody PaginationCriteria paginationCriteria) {
        return productPurchaseHistoryService.getProductPurchaseHistoryOrganization(paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping(path = "/search-purchase-history-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse searchProductPurchaseHistoryWithPagination(@RequestParam String productName, @RequestParam String supplierName,
                                                                                 @RequestBody PaginationCriteria paginationCriteria) {
        return productPurchaseHistoryService.searchProductPurchaseHistoryWithPagination(productName, supplierName, paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping(path = "/delete-purchase-history", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public void deletePurchaseHistory(@RequestParam String productName, @RequestBody List<String> supplierNameAndDateList) {
        if (CollectionUtils.isEmpty(supplierNameAndDateList) || StringUtils.isEmpty(productName)) {
            return;
        }
        productPurchaseHistoryService.deletePurchaseHistory(productName, supplierNameAndDateList);
    }

}
