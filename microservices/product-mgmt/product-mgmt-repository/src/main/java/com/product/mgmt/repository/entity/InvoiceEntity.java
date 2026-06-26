package com.product.mgmt.repository.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "invoice")
@Data
public class InvoiceEntity {

    @EmbeddedId
    private InvoiceEntityId invoiceEntityId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_address")
    private String customerAddress;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
    private String status; // DRAFT / COMPLETED

    /// --------- Base entity fields ---------
    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "expiry_date")
    private Long expiryDate;

    @Column(name = "is_expired")
    private boolean isExpired;

    @Column(name = "created_date")
    private Long createdDate;

    @Column(name = "created_user_id", length = 255)
    private String createdUserId;

    @Column(name = "created_user_name", length = 255)
    private String createdUserName;

    @Column(name = "updated_date")
    private Long updatedDate;

    @Column(name = "updated_user_id", length = 255)
    private String updatedUserId;

    @Column(name = "updated_user_name", length = 255)
    private String updatedUserName;

}
