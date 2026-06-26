package com.product.mgmt.repository.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Data
@Embeddable
public class InvoiceEntityId {

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(name = "invoice_number", nullable = false, length = 36)
    private String invoiceNumber;

}
