package com.product.mgmt.repository.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class InvoiceItemEntityId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(name = "invoice_number", nullable = false, length = 36)
    private String invoiceNumber;

    @Column(name = "invoice_item_id", nullable = false, length = 36)
    private String invoiceItemId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;
}
