package com.product.mgmt.service.impl;

import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.service.ProductPurchaseHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPurchaseHistoryServiceImpl implements ProductPurchaseHistoryService {

    @Autowired
    private ProductPurchaseHistoryRepository productPurchaseHistoryRepository;

    @Override
    public List<ProductPurchaseHistoryDTO> getProductPurchaseHistory(String productName) {
        return productPurchaseHistoryRepository.getProductPurchaseHistory(productName);
    }
}
