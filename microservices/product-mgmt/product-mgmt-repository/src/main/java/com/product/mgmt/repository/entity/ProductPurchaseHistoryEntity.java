package com.product.mgmt.repository.entity;

import lombok.Data;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.io.Serializable;


@Data
@Table("product_purchase_history")
public class ProductPurchaseHistoryEntity implements Serializable {

    @PrimaryKey
    private ProductPurchaseHistoryEntityId productPurchaseHistoryEntityId;

    @Column("unit_list_price")
    private Double unitListPrice;

    @Column("total_list_price")
    private Double totalListPrice;

    @Column("unit_buy_price")
    private Double unitBuyPrice;

    @Column("total_buy_price")
    private Double totalBuyPrice;

    @Column("buy_discount")
    private Double unitBuyDiscount;

    @Column("unit_sell_price")
    private Double unitSellPrice;

    @Column("total_sell_price")
    private Double totalSellPrice;

    @Column("sell_discount")
    private Double unitSellDiscount;

    @Column("purchased_quantity")
    private Long purchasedQuantity;

    @Column("remaining_quantity")
    private Long remainingQuantity;

    @Column("sold_quantity")
    private Long soldQuantity;

    /// --------- Base entity fields ---------
    @Column("is_deleted")
    private boolean isDeleted;

    @Column("expiry_date")
    private Long expiryDate;

    @Column("is_expired")
    private boolean isExpired;

    @Column("created_date")
    private Long createdDate;

    @Column("created_user_id")
    private String createdUserId;

    @Column("created_user_name")
    private String createdUserName;

    @Column("updated_date")
    private Long updatedDate;

    @Column("updated_user_id")
    private String updatedUserId;

    @Column("updated_user_name")
    private String updatedUserName;
}
