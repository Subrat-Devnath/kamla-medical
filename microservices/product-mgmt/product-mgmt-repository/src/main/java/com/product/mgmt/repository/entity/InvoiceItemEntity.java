package com.product.mgmt.repository.entity;

import lombok.Data;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Data
@Entity
@Table(name = "invoice_items")
public class InvoiceItemEntity {

    @EmbeddedId
    private InvoiceItemEntityId invoiceItemEntityId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_list_price")
    private Double unitListPrice;

    @Column(name = "unit_sell_price")
    private Double unitSellPrice;

    @Column(name = "unit_sell_discount")
    private Double unitSellDiscount;

    @Column(name = "total_sell_price")
    private Double totalSellPrice;

    @Column(name = "total_sell_discount")
    private Double totalSellDiscount;

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
