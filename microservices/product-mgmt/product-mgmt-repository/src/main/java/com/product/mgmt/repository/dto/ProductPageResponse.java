package com.product.mgmt.repository.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPageResponse {

    private List<ProductDTO> products;

    // send this in next API request
    private String nextPageState;

    private boolean hasNext;
}