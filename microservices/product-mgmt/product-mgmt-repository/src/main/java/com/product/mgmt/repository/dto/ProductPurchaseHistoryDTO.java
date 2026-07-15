package com.product.mgmt.repository.dto;

import com.common.service.dtos.BaseDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class ProductPurchaseHistoryDTO extends BaseDTO implements Serializable {

    private String userId;

    private String productName;

    private Long purchaseDate;

    private Double unitListPrice;

    private Double totalListPrice;

    private Double unitBuyPrice;

    private Double totalBuyPrice;

    private Double unitBuyDiscount;

    private Long purchasedQuantity;

    private String supplierName;

}
