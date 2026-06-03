package com.product.mgmt.repository.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;



@Table(name = "product_purchase_history")
@Entity
@Data
public class ProductPurchaseHistoryEntity implements Serializable {

    @EmbeddedId
    private ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId;

    @Column(name = "unit_list_price")
    private Double unitListPrice;

    @Column(name = "total_list_price")
    private Double totalListPrice;

    @Column(name = "unit_buy_price")
    private Double unitBuyPrice;

    @Column(name = "total_buy_price")
    private Double totalBuyPrice;

    @Column(name = "buy_discount")
    private Double unitBuyDiscount;

    @Column(name = "unit_sell_price")
    private Double unitSellPrice;

    @Column(name = "total_sell_price")
    private Double totalSellPrice;

    @Column(name = "sell_discount")
    private Double unitSellDiscount;

    @Column(name = "purchased_quantity")
    private Long purchasedQuantity;

    @Column(name = "remaining_quantity")
    private Long remainingQuantity;

    @Column(name = "sold_quantity")
    private Long soldQuantity;

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
