package com.product.mgmt.service.impl;

import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.service.ProductPurchaseHistoryService;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductPurchaseHistoryServiceImpl implements ProductPurchaseHistoryService {

    @Autowired
    private ProductPurchaseHistoryRepository productPurchaseHistoryRepository;

    @Override
    public DataWithPaginationResponse getProductPurchaseHistory(String productName, PaginationCriteria paginationCriteria) {
        return productPurchaseHistoryRepository.getProductPurchaseHistory(productName, paginationCriteria);
    }

    @Override
    public DataWithPaginationResponse getProductPurchaseHistoryOrganization(Integer pageSize, String pageState) {
        return productPurchaseHistoryRepository.getProductPurchaseHistoryOrganization(SecurityUtil.getPrincipal().getOrgId(), pageSize, pageState);
    }

    @Override
    public DataWithPaginationResponse searchProductPurchaseHistoryWithPagination(String productName, String supplierName, Integer pageSize, String pageState) {
        return productPurchaseHistoryRepository.searchProductPurchaseHistoryWithPagination(productName, supplierName, pageSize, pageState);
    }
}
