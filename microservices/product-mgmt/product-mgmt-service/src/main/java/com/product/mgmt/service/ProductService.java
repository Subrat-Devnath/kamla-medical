package com.product.mgmt.service;

import com.common.service.dtos.PaginationCriteria;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.ProductPageResponse;

import java.util.List;

public interface ProductService {

    void addProduct(ProductDTO productDto);

    ProductDTO getProduct(String productName);

    List<ProductDTO> searchProduct(String productName);

    void deleteProduct(List<String> productNames);

    List<ProductDTO> getAllProducts();

    ProductPageResponse getProductsByOrganizationId(Integer pageSize, String pageState);

    ProductPageResponse searchProductWithPagination(String productName, Integer pageSize, String pageState);

    /**
     * Get product quantity by product name
     * Returns only the product_quantity field
     */
    Long getProductQuantity(String productName);
}
