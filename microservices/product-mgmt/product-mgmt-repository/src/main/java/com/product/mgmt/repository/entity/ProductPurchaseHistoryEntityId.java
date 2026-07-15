package com.product.mgmt.repository.entity;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class ProductPurchaseHistoryEntityId implements Serializable {

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "supplier_name", nullable = false, length = 255)
    private String supplierName;

    @Column(name = "purchase_date", nullable = false)
    private Long purchaseDate;
}

