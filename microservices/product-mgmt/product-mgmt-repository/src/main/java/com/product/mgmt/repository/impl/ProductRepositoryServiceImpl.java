package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.configuration.ObjectMapperUtils;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.ProductRepository;
import com.product.mgmt.repository.dao.ProductDAO;
import com.product.mgmt.repository.dao.ProductPurchaseHistoryDAO;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntityId;
import com.security.config.utils.SecurityUtil;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(ProductRepositoryServiceImpl.class);

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

        SecurityUtil.setCreationDetails(productDto);

        ProductEntity entity = ObjectBuilder.buildDtoFromEntity(productDto, null, ProductEntity.class);
        ProductEntityId productEntityId = new ProductEntityId();
        productEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productEntityId.setUserId(SecurityUtil.getPrincipal().getUserId());
        productEntityId.setProductName(productDto.getProductName().trim().toUpperCase());
        entity.setProductEntityId(productEntityId);
        productDao.save(entity);

        ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId = getProductPurchaseHistoryEntityId(productDto);

        ProductPurchaseHistoryEntity productPurchaseHistoryEntity = ObjectBuilder.buildDtoFromEntity(productDto, null, ProductPurchaseHistoryEntity.class);

        productPurchaseHistoryEntity.setProductPurchaseHistoryEntityId(productPurchaseHistoryEntityId);

        Long purchaseProductQuantity = productPurchaseHistoryDAO.getPurchaseProductQuantity(productPurchaseHistoryEntityId.getOrganizationId(), productPurchaseHistoryEntityId.getUserId(), productPurchaseHistoryEntityId.getProductName(), productPurchaseHistoryEntityId.getSupplierName(), productPurchaseHistoryEntityId.getPurchaseDate());

        if (purchaseProductQuantity != null) {
            productPurchaseHistoryEntity.setPurchasedQuantity(productPurchaseHistoryEntity.getPurchasedQuantity() + purchaseProductQuantity);
        }

        productPurchaseHistoryDAO.save(productPurchaseHistoryEntity);
    }

    private ProductPurchaseHistoryEntityId getProductPurchaseHistoryEntityId(ProductDTO productDto) {
        ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId = new ProductPurchaseHistoryEntityId();
        productPurchaseHistoryEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productPurchaseHistoryEntityId.setUserId(SecurityUtil.getPrincipal().getUserId());
        productPurchaseHistoryEntityId.setProductName(productDto.getProductName().toUpperCase());
        productPurchaseHistoryEntityId.setSupplierName(productDto.getSupplierName().toUpperCase());
        productPurchaseHistoryEntityId.setPurchaseDate(productDto.getPurchaseDate());
        return productPurchaseHistoryEntityId;
    }

    @Override
    public ProductDTO getProduct(String productName) {

        ProductEntityId productEntityId = new ProductEntityId();
        productEntityId.setOrganizationId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId());
        productEntityId.setUserId(Objects.requireNonNull(SecurityUtil.getPrincipal()).getUserId());
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

        List<ProductEntity> products = productDao.searchProducts(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId(), SecurityUtil.getPrincipal().getUserId(), start, end);

        if (CollectionUtils.isEmpty(products)) {
            return List.of();
        }

        return products.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(entity, entity.getProductEntityId(), ProductDTO.class)).collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(List<String> productNames) {

        if (CollectionUtils.isEmpty(productNames)) {
            logger.info("No product names provided for deletion for organizationId: {}, userId: {}", SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId());
            return;
        }

        productDao.softDeleteProduct(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productNames);

        productPurchaseHistoryDAO.softDeleteProductPurchaseHistory(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productNames);
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
    public DataWithPaginationResponse getProductsByOrganizationId(String organizationId, Integer pageSize, String pageState) {

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductEntity> allProducts = productDao.findByProductEntityIdOrganizationIdAndProductEntityIdUserId(organizationId, SecurityUtil.getPrincipal().getUserId(), pageable);

        return getDataWithPaginationResponse(allProducts, pageNumber);
    }

    @Override
    public DataWithPaginationResponse searchProductWithPagination(String organizationId, String productNameOrFormula, Integer pageSize, String pageState) {

        if (!StringUtils.hasLength(productNameOrFormula)) {
            return new DataWithPaginationResponse(Collections.emptyList(), null, false);
        }

        String start = productNameOrFormula.toUpperCase();
        String end = start + Character.MAX_VALUE;

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<ProductEntity> searchResults = productDao.searchProductsWithPagination(organizationId, SecurityUtil.getPrincipal().getUserId(), start, end, pageable);

        return getDataWithPaginationResponse(searchResults, pageNumber);
    }

    private static DataWithPaginationResponse getDataWithPaginationResponse(Page<ProductEntity> searchResults, int pageNumber) {

        DataWithPaginationResponse response = new DataWithPaginationResponse();

        if (searchResults == null || !searchResults.hasContent()) {
            response.setData(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        List<ProductDTO> products = searchResults.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity ->
                        ObjectBuilder.buildDtoFromEntity(modelMapper,
                                entity,
                                entity.getProductEntityId(),
                                ProductDTO.class
                        )
                )
                .collect(Collectors.toList());

        response.setData(products);

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
    public Long getProductQuantity(String organizationId, String userId, String productName) {
        if (!StringUtils.hasLength(productName)) {
            return null;
        }
        return productDao.getProductQuantity(organizationId, SecurityUtil.getPrincipal().getUserId(), productName.toUpperCase());
    }

    @Override
    public void updateProductQuantity(Map<String, Integer> productNameAndQuantityMap) {

        List<ProductEntity> products = productDao.getProducts(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), new ArrayList<>(productNameAndQuantityMap.keySet()));

        for (ProductEntity product : products) {
            String productName = product.getProductEntityId().getProductName();
            Integer quantityToDeduct = productNameAndQuantityMap.get(productName);
            if (quantityToDeduct != null) {
                Long currentQuantity = product.getProductQuantity();
                long newQuantity = currentQuantity - quantityToDeduct;
                if (newQuantity < 0) {
                    newQuantity = 0L; // Prevent negative quantity
                }
                product.setProductQuantity(newQuantity);
            }
        }

        productDao.saveAll(products);
    }
}