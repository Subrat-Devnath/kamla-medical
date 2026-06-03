package com.product.mgmt.repository.entity;

import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Embeddable;

import java.io.Serializable;

@Data
@Embeddable
public class ProductPurchaseHistoryEntityId implements Serializable {

    @Column(name = "organization_id", nullable = false, length = 255)
    private String organizationId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "supplier_name", nullable = false, length = 255)
    private String supplierName;

    @Column(name = "purchase_date", nullable = false)
    private Long purchaseDate;
}

