package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.dao.ProductPurchaseHistoryDAO;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class ProductPurchaseHistoryRepositoryImpl implements ProductPurchaseHistoryRepository {

    @Autowired
    private ProductPurchaseHistoryDAO productPurchaseHistoryDAO;

    @Override
    public List<ProductPurchaseHistoryDTO> getProductPurchaseHistory(String productName) {

        if (!StringUtils.hasLength(productName)) {
            return List.of();
        }

        List<ProductPurchaseHistoryEntity> productPrices = productPurchaseHistoryDAO.getProductPrices(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), SecurityUtil.getPrincipal().getUserId(), productName.toUpperCase());

        if (CollectionUtils.isEmpty(productPrices)) {
            return List.of();
        }

        return productPrices.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductPurchaseHistoryEntityId(), ProductPurchaseHistoryDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<ProductPurchaseHistoryDTO> getProductQuantities(List<String> productNames) {
        List<ProductPurchaseHistoryEntity> productPrices = productPurchaseHistoryDAO.getProductQuantities(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), SecurityUtil.getPrincipal().getUserId(), productNames);

        if (CollectionUtils.isEmpty(productPrices)) {
            return List.of();
        }

        return productPrices.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductPurchaseHistoryEntityId(), ProductPurchaseHistoryDTO.class)).collect(Collectors.toList());
    }
}


