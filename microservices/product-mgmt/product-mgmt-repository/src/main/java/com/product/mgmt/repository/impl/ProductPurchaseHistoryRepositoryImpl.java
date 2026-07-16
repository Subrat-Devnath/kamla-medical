package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.configuration.ObjectMapperUtils;
import com.common.service.dtos.PaginationCriteria;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.dao.ProductPurchaseHistoryDAO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.security.config.utils.SecurityUtil;
import org.modelmapper.ModelMapper;
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
        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        List<ProductPurchaseHistoryDTO> productPricesDto = productPricesEntity.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity -> ObjectBuilder.buildDtoFromEntity(modelMapper,
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
    public DataWithPaginationResponse getProductPurchaseHistoryOrganization(String organizationId, Integer pageSize, String pageState) {

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductPurchaseHistoryEntity> productPurchaseHistoryEntities = productPurchaseHistoryDAO.findByProductPurchaseHistoryEntityIdOrganizationIdAndProductPurchaseHistoryEntityIdUserId(organizationId, SecurityUtil.getPrincipal().getUserId(), pageable);

        return getDataWithPaginationResponse(productPurchaseHistoryEntities, pageNumber);
    }

    private DataWithPaginationResponse getDataWithPaginationResponse(Page<ProductPurchaseHistoryEntity> searchResults, int pageNumber) {

        DataWithPaginationResponse response = new DataWithPaginationResponse();

        if (searchResults == null || !searchResults.hasContent()) {
            response.setData(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        List<ProductPurchaseHistoryDTO> productPurchaseHistoryDTOList = searchResults.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity ->
                        ObjectBuilder.buildDtoFromEntity(modelMapper,
                                entity,
                                entity.getProductPurchaseHistoryEntityId(),
                                ProductPurchaseHistoryDTO.class
                        )
                )
                .collect(Collectors.toList());

        response.setData(productPurchaseHistoryDTOList);

        // Check if next page exists
        if (!searchResults.hasNext()) {
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

        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        return productPrices.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(modelMapper, entity, entity.getProductPurchaseHistoryEntityId(), ProductPurchaseHistoryDTO.class)).collect(Collectors.toList());
    }

    @Override
    public DataWithPaginationResponse searchProductPurchaseHistoryWithPagination(String productName, String supplierName, Integer pageSize, String pageState) {

        if (!StringUtils.hasLength(supplierName)) {
            return new DataWithPaginationResponse(Collections.emptyList(), null, false);
        }

        String start = supplierName.toUpperCase();
        String end = start + Character.MAX_VALUE;

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductPurchaseHistoryEntity> searchResults = productPurchaseHistoryDAO.searchProductPurchaseHistoryWithPagination(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productName, start, end, pageable);

        return getDataWithPaginationResponse(searchResults, pageNumber);
    }

    @Override
    public void deletePurchaseHistory(String productName, List<String> supplierNameAndDateList) {
        if (CollectionUtils.isEmpty(supplierNameAndDateList)) {
            logger.warn("No supplier names and dates provided for deletion of purchase history for product: {}", productName);
            return;
        }
        List<String> supplierNames = supplierNameAndDateList.stream().map(supplierNameAndDate -> supplierNameAndDate.split("-")[0]).collect(Collectors.toList());
        List<Long> purchaseDates = supplierNameAndDateList.stream()
                .map(supplierNameAndDate -> supplierNameAndDate.split("-")[1])
                .map(Long::parseLong)
                .collect(Collectors.toList());
        productPurchaseHistoryDAO.softDeletePurchaseHistory(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productName, supplierNames, purchaseDates);
    }
}


