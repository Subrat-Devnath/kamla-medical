package com.product.mgmt.service.impl;

import com.product.mgmt.repository.ProductPurchaseHistoryRepository;
import com.product.mgmt.repository.ProductRepository;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.ProductPurchaseHistoryDTO;
import com.product.mgmt.service.ProductService;
import com.product.mgmt.service.utils.DiscountCalculatorUtil;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPurchaseHistoryRepository productPurchaseHistoryRepository;

    @Override
    public void addProduct(ProductDTO productDto) {
        productDto.setProductQuantity(productDto.getPurchasedQuantity());
        Long productQuantity = productRepository.getProductQuantity(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productDto.getProductName().toUpperCase());
        if (productQuantity != null) {
            productDto.setProductQuantity(productDto.getProductQuantity() + productQuantity);
        }
        productDto.setUnitBuyDiscount(DiscountCalculatorUtil.calculateBuyDiscountPercentage(productDto.getUnitListPrice(), productDto.getUnitBuyPrice()));
        productDto.setTotalListPrice(DiscountCalculatorUtil.calculateTotalListPrice(productDto.getUnitListPrice(), productDto.getPurchasedQuantity()));
        productDto.setTotalBuyPrice(DiscountCalculatorUtil.calculateTotalBuyPrice(productDto.getUnitBuyPrice(), productDto.getPurchasedQuantity()));
        productRepository.addProduct(productDto);
    }

    @Override
    public ProductDTO getProduct(String productName) {

        ProductDTO product = productRepository.getProduct(productName);

        if (product == null) {
            return null;
        }

        Map<String, Long> mapOfProductKeysAndTotalQuantity = mapOfProductKeysAndTotalQuantity(Collections.singletonList(product.getProductName()));

        product.setTotalQuantity(mapOfProductKeysAndTotalQuantity.get(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId() + "-" + product.getProductName()));

        return product;
    }

    private Map<String, Long> mapOfProductKeysAndTotalQuantity(List<String> productNames) {

        List<ProductPurchaseHistoryDTO> productQuantities = productPurchaseHistoryRepository.getProductQuantities(productNames);

        if (CollectionUtils.isEmpty(productQuantities)) {
            return Collections.emptyMap();
        }

        return productQuantities.stream().filter(p -> p.getRemainingQuantity() != null).collect(Collectors.groupingBy(p -> Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId() + "-" + p.getProductName(), Collectors.summingLong(ProductPurchaseHistoryDTO::getRemainingQuantity)));
    }

    @Override
    public List<ProductDTO> searchProduct(String productName) {

        List<ProductDTO> productDTOS = productRepository.searchProduct(productName);

        if (CollectionUtils.isEmpty(productDTOS)) {
            return List.of();
        }

        Map<String, Long> mapOfProductKeysAndTotalQuantity = mapOfProductKeysAndTotalQuantity(productDTOS.stream().map(ProductDTO::getProductName).toList());

        productDTOS.forEach(productDTO -> productDTO.setTotalQuantity(mapOfProductKeysAndTotalQuantity.get(Objects.requireNonNull(SecurityUtil.getPrincipal()).getOrgId() + "-" + productDTO.getProductName())));

        return productDTOS;
    }

    @Override
    public void deleteProduct(List<String> productNames) {
        productRepository.deleteProduct(productNames);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.getAllProducts();
    }

    @Override
    public DataWithPaginationResponse getProductsByOrganizationId(Integer pageSize, String pageState) {
        return productRepository.getProductsByOrganizationId(SecurityUtil.getPrincipal().getOrgId(), pageSize, pageState);
    }

    @Override
    public DataWithPaginationResponse searchProductWithPagination(String productName, Integer pageSize, String pageState) {
        return productRepository.searchProductWithPagination(SecurityUtil.getPrincipal().getOrgId(), productName, pageSize, pageState);
    }

    @Override
    public Long getProductQuantity(String productName) {
        return productRepository.getProductQuantity(SecurityUtil.getPrincipal().getOrgId(), SecurityUtil.getPrincipal().getUserId(), productName);
    }

}
