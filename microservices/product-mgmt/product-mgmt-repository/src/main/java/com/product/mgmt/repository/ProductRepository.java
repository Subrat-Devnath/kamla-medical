package com.product.mgmt.repository;

import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;

import java.util.List;

public interface ProductRepository {

    void addProduct(ProductDTO productDto);

    ProductDTO getProduct(String productName);

    List<ProductDTO> searchProduct(String productName);

    void deleteProduct(List<String> productNames);

    List<ProductDTO> getAllProducts();

    DataWithPaginationResponse getProductsByOrganizationId(String organizationId, Integer pageSize, String pageState);

    DataWithPaginationResponse searchProductWithPagination(String organizationId, String productName, Integer pageSize, String pageState);

    /**
     * Get product quantity by product name
     * Returns only the product_quantity field
     */
    Long getProductQuantity(String organizationId, String userId, String productName);
}
