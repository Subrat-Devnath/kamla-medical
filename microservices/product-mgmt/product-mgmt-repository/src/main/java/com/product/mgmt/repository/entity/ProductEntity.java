package com.product.mgmt.repository.entity;

import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import lombok.Data;

@Table("product")
@Data
public class ProductEntity {

    @PrimaryKey
    private ProductEntityId productEntityId;

    @Column("category")
    private String category;

    @Column("product_quantity")
    private Long productQuantity;

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
