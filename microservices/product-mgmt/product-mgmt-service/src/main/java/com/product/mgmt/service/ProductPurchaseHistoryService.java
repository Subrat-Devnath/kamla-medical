package com.product.mgmt.service;

import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;

import java.util.List;

public interface ProductPurchaseHistoryService {

    DataWithPaginationResponse getProductPurchaseHistory(String productName, PaginationCriteria paginationCriteria);

    DataWithPaginationResponse getProductPurchaseHistoryOrganization(Integer pageSize, String pageState);

    DataWithPaginationResponse searchProductPurchaseHistoryWithPagination(String productName, String supplierName, Integer pageSize, String pageState);
}
