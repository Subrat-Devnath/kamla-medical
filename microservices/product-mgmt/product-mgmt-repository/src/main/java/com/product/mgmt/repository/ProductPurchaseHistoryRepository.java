package com.product.mgmt.repository;

import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;

import java.util.List;

public interface ProductPurchaseHistoryRepository {

    DataWithPaginationResponse getProductPurchaseHistory(String productName, PaginationCriteria paginationCriteria);

    DataWithPaginationResponse getProductPurchaseHistoryOrganization(String organizationId, Integer pageSize, String pageState);

    List<ProductPurchaseHistoryDTO> getProductQuantities(List<String> productName);

    DataWithPaginationResponse searchProductPurchaseHistoryWithPagination(String productName, String supplierName, Integer pageSize, String pageState);
}
