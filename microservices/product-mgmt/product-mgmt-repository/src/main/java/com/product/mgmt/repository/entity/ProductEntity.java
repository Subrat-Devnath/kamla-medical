package com.product.mgmt.repository.entity;


import lombok.Data;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Table(name = "product")
@Entity
@Data
public class ProductEntity {

    @EmbeddedId
    private ProductEntityId productEntityId;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "product_quantity")
    private Long productQuantity;

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
