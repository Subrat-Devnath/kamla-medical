package com.product.mgmt.repository.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Data
@Embeddable
public class InvoiceItemEntityId {

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(name = "invoice_number", nullable = false, length = 36)
    private String invoiceNumber;

    @Column(name = "invoice_item_id", nullable = false, length = 36)
    private String invoiceItemId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;
}
