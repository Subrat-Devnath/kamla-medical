package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.dao.ProductPurchaseHistoryDAO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.security.config.utils.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class ProductPurchaseHistoryRepositoryImpl implements ProductPurchaseHistoryRepository {

    private static final Logger logger = LoggerFactory.getLogger(ProductPurchaseHistoryRepositoryImpl.class);

    @Autowired
    private ProductPurchaseHistoryDAO productPurchaseHistoryDAO;

    @Override
    public DataWithPaginationResponse getProductPurchaseHistory(String productName, PaginationCriteria paginationCriteria) {

        if (!StringUtils.hasLength(productName)) {
            return null;
        }

        String start = productName.toUpperCase();
        String end = start + Character.MAX_VALUE;

        int pageSize = paginationCriteria.getPageSize();
        String pageState = paginationCriteria.getPageState();

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = 0;
        if (StringUtils.hasLength(pageState)) {
            try {
                pageNumber = Integer.parseInt(pageState);
            } catch (NumberFormatException e) {
                logger.warn("Invalid pageState: {}. Defaulting to pageNumber 0.", pageState);
            }
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<ProductPurchaseHistoryEntity> productPricesEntity = productPurchaseHistoryDAO.getProductPrices(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), SecurityUtil.getPrincipal().getUserId(), start, end, pageable);


        DataWithPaginationResponse response = new DataWithPaginationResponse();

        if (productPricesEntity == null || !productPricesEntity.hasContent()) {
            response.setData(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        List<ProductPurchaseHistoryDTO> productPricesDto = productPricesEntity.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity -> ObjectBuilder.buildDtoFromEntity(
                        entity,
                        entity.getProductPurchaseHistoryEntityId(),
                        ProductPurchaseHistoryDTO.class
                ))
                .collect(Collectors.toList());

        response.setData(productPricesDto);

        // Check if next page exists
        if (!productPricesEntity.hasNext()) {
            response.setHasNext(false);
            return response;
        }

        // Set next page state as the next page number
        response.setNextPageState(String.valueOf(pageNumber + 1));
        response.setHasNext(true);

        return response;
    }


    @Override
    public List<ProductPurchaseHistoryDTO> getProductQuantities(List<String> productNames) {
        List<ProductPurchaseHistoryEntity> productPrices = productPurchaseHistoryDAO.getProductQuantities(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), SecurityUtil.getPrincipal().getUserId(), productNames);

        if (CollectionUtils.isEmpty(productPrices)) {
            logger.info("No product purchase history found for productNames: {}, orgId: {}, userId: {}", productNames, SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId());
            return List.of();
        }

        return productPrices.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductPurchaseHistoryEntityId(), ProductPurchaseHistoryDTO.class)).collect(Collectors.toList());
    }
}


