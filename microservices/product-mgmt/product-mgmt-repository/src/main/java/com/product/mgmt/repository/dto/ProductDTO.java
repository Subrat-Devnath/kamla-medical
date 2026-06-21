package com.product.mgmt.repository.dto;

import lombok.Data;

@Data
public class ProductDTO extends ProductPurchaseHistoryDTO {

    private String productName;

    private String formula;

    private Long totalQuantity;

    private Long productQuantity;
    
    private String category;

}
