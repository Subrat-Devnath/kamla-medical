package com.product.mgmt.repository.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class ProductPurchaseHistoryDTO implements Serializable {

    private String userId;

    private String productName;

    private Long purchaseDate;

    private Double unitListPrice;

    private Double totalListPrice;

    private Double unitBuyPrice;

    private Double totalBuyPrice;

    private Double unitBuyDiscount;

    private Long purchasedQuantity;

    private Long remainingQuantity;

    private Long soldQuantity;

    private String supplierName;

    private boolean isDeleted = false;

    private boolean isExpired = false;

    private Long expiryDate;

    private Long createdDate;

    private String createdUserName;

    private String createdUserId;

    private Long updatedDate;

    private String updatedUserName;

    private String updatedUserId;

}
