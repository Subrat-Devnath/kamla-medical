package com.product.mgmt.controller;

import com.common.service.dtos.ResponseDTO;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.dto.ProductPageResponse;
import com.product.mgmt.service.ProductService;
import com.security.config.utils.SecurityUtil;
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

    @GetMapping(path = "/{productName}")
    public ResponseDTO deleteProduct(@PathVariable(name = "productName") String productName) {
        productService.deleteProduct(productName);
        return new ResponseDTO(true, null, null);
    }

    @GetMapping(path = "/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }


    @PostMapping(path = "/products-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ProductPageResponse getProductsByOrganization(
            @RequestBody PaginationCriteria paginationCriteria) {
        return productService.getProductsByOrganizationId(paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @PostMapping(path = "/search-products-with-pagination", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ProductPageResponse searchProductsWithPagination(@RequestParam String productName,
                                                            @RequestBody PaginationCriteria paginationCriteria) {
        return productService.searchProductWithPagination(productName, paginationCriteria.getPageSize(), paginationCriteria.getPageState());
    }

    @GetMapping(path = "/product-quantity/{productName}")
    public Long getProductQuantity(@PathVariable(name = "productName") String productName) {
        return productService.getProductQuantity(productName);
    }

}
