package com.product.mgmt.service;

import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;

import java.util.List;

public interface ProductPurchaseHistoryService {

    List<ProductPurchaseHistoryDTO> getProductPurchaseHistory(String productName);

}
