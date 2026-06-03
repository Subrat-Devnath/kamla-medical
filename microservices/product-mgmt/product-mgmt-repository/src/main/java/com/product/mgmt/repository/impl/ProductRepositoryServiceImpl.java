package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.product.mgmt.repository.ProductRepository;
import com.product.mgmt.repository.dao.ProductDAO;
import com.product.mgmt.repository.dao.ProductPurchaseHistoryDAO;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.ProductPageResponse;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntityId;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductRepositoryServiceImpl implements ProductRepository {

    @Autowired
    private ProductDAO productDao;

    @Autowired
    private ProductPurchaseHistoryDAO productPurchaseHistoryDAO;


    @Override
    public void addProduct(ProductDTO productDto) {

        if (productDto.getPurchaseDate() == null) {
            //Set current date as purchase date for the product
            productDto.setPurchaseDate(java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli());
        }

        productDto.setCreatedUserId(SecurityUtil.getPrincipal().getUserId());
        productDto.setCreatedUserName(SecurityUtil.getPrincipal().getUserName());
        productDto.setCreatedDate(System.currentTimeMillis());

        productDto.setUpdatedUserId(SecurityUtil.getPrincipal().getUserId());
        productDto.setUpdatedUserName(SecurityUtil.getPrincipal().getUserName());
        productDto.setUpdatedDate(System.currentTimeMillis());

        ProductEntity entity = ObjectBuilder.buildDtoFromEntity(productDto, null, ProductEntity.class);
        ProductEntityId productEntityId = new ProductEntityId();
        productEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productEntityId.setProductName(productDto.getProductName().toUpperCase());
        entity.setProductEntityId(productEntityId);
        productDao.save(entity);

        ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId = getProductPurchaseHistoryEntityId(productDto);

        ProductPurchaseHistoryEntity productPurchaseHistoryEntity = ObjectBuilder.buildDtoFromEntity(productDto, null, ProductPurchaseHistoryEntity.class);

        productPurchaseHistoryEntity.setProductPurchaseHistoryEntityId(productPurchaseHistoryEntityId);

        productPurchaseHistoryDAO.save(productPurchaseHistoryEntity);
    }

    private ProductPurchaseHistoryEntityId getProductPurchaseHistoryEntityId(ProductDTO productDto) {
        ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId = new ProductPurchaseHistoryEntityId();
        productPurchaseHistoryEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productPurchaseHistoryEntityId.setProductName(productDto.getProductName().toUpperCase());
        productPurchaseHistoryEntityId.setSupplierName(productDto.getSupplierName().toUpperCase());
        productPurchaseHistoryEntityId.setPurchaseDate(productDto.getPurchaseDate());
        return productPurchaseHistoryEntityId;
    }

    @Override
    public ProductDTO getProduct(String productName) {

        ProductEntityId productEntityId = new ProductEntityId();
        productEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productEntityId.setProductName(productName.toUpperCase());

        Optional<ProductEntity> entityOpt = productDao.findById(productEntityId);

        if (entityOpt.isEmpty()) {
            return null;
        }

        return entityOpt.filter(entity -> !entity.isDeleted()).map(productEntity -> ObjectBuilder.buildDtoFromEntity(productEntity, productEntity.getProductEntityId(), ProductDTO.class)).orElse(null);
    }

    @Override
    public List<ProductDTO> searchProduct(String productName) {

        if (!StringUtils.hasLength(productName)) {
            return List.of();
        }
        String start = productName.toUpperCase();
        String end = start + Character.MAX_VALUE;

        List<ProductEntity> products = productDao.searchProducts(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), start, end);

        if (CollectionUtils.isEmpty(products)) {
            return List.of();
        }

        return products.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductEntityId(), ProductDTO.class)).collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(String productName) {
        ProductEntityId productEntityId = new ProductEntityId();
        productEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productEntityId.setProductName(productName.toUpperCase());

        productDao.deleteById(productEntityId);
    }

    @Override
    public List<ProductDTO> getAllProducts() {

        List<ProductEntity> allProducts = productDao.findAll();

        if (CollectionUtils.isEmpty(allProducts)) {
            return null;
        }

        return allProducts.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductEntityId(), ProductDTO.class)).collect(Collectors.toList());
    }

    @Override
    public ProductPageResponse getProductsByOrganizationId(String organizationId, Integer pageSize, String pageState) {

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = 0;
        if (StringUtils.hasLength(pageState)) {
            try {
                pageNumber = Integer.parseInt(pageState);
            } catch (NumberFormatException e) {
                pageNumber = 0;
            }
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductEntity> allProducts = productDao.findByProductEntityIdOrganizationId(organizationId, pageable);

        ProductPageResponse response = new ProductPageResponse();

        if (allProducts == null || !allProducts.hasContent()) {
            response.setProducts(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        List<ProductDTO> products = allProducts.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity ->
                        ObjectBuilder.buildDtoFromEntity(
                                entity,
                                entity.getProductEntityId(),
                                ProductDTO.class
                        )
                )
                .collect(Collectors.toList());

        response.setProducts(products);

        // Check if next page exists
        if (!allProducts.hasNext()) {
            response.setHasNext(false);
            return response;
        }

        // Set next page state as the next page number
        response.setNextPageState(String.valueOf(pageNumber + 1));
        response.setHasNext(true);

        return response;
    }

    @Override
    public ProductPageResponse searchProductWithPagination(String organizationId, String productName, Integer pageSize, String pageState) {

        if (!StringUtils.hasLength(productName)) {
            return new ProductPageResponse(Collections.emptyList(), null, false);
        }

        String start = productName.toUpperCase();
        String end = start + Character.MAX_VALUE;

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = 0;
        if (StringUtils.hasLength(pageState)) {
            try {
                pageNumber = Integer.parseInt(pageState);
            } catch (NumberFormatException e) {
                pageNumber = 0;
            }
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductEntity> searchResults = productDao.searchProductsWithPagination(organizationId, start, end, pageable);

        ProductPageResponse response = new ProductPageResponse();

        if (searchResults == null || !searchResults.hasContent()) {
            response.setProducts(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        List<ProductDTO> products = searchResults.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity ->
                        ObjectBuilder.buildDtoFromEntity(
                                entity,
                                entity.getProductEntityId(),
                                ProductDTO.class
                        )
                )
                .collect(Collectors.toList());

        response.setProducts(products);

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
    public Long getProductQuantity(String organizationId, String productName) {
        if (!StringUtils.hasLength(productName)) {
            return null;
        }
        return productDao.getProductQuantity(organizationId, productName.toUpperCase());
    }
}