package com.product.mgmt.controller;

import com.common.service.dtos.ResponseDTO;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.common.service.dtos.PaginationCriteria;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping(path = "/product", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseDTO addProduct(@RequestBody ProductDTO productDto) {
        productService.addProduct(productDto);
        return new ResponseDTO(true, null, null);
    }

    @GetMapping(path = "/product/{productName}")
    public ProductDTO getProduct(@PathVariable(name = "productName") String productName) {
        return productService.getProduct(productName);
    }

    @GetMapping(path = "/products/{productName}")
    public List<ProductDTO> searchProduct(@PathVariable(name = "productName") String productName) {
        return productService.searchProduct(productName);
    }

    @DeleteMapping(path = "/delete-product-and-history", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseDTO deleteProduct(@RequestBody List<String> productNames) {
        productService.deleteProduct(productNames);
        return new ResponseDTO(true, null, null);
    }

    @GetMapping(path = "/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping(path = "/products-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse getProductsByOrganization(
            @RequestBody PaginationCriteria paginationCriteria) {
        return productService.getProductsByOrganizationId(paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping(path = "/search-products-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public DataWithPaginationResponse searchProductsWithPagination(@RequestParam String productNameOrFormula,
                                                                   @RequestBody PaginationCriteria paginationCriteria) {
        return productService.searchProductWithPagination(productNameOrFormula, paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @GetMapping(path = "/product-quantity/{productName}")
    public Long getProductQuantity(@PathVariable(name = "productName") String productName) {
        return productService.getProductQuantity(productName);
    }

}
