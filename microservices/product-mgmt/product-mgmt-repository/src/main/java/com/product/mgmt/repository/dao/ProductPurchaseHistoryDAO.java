package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductPurchaseHistoryDAO extends JpaRepository<ProductPurchaseHistoryEntity, ProductPurchaseHistoryEntityId> {

    @Query("SELECT p FROM ProductPurchaseHistoryEntity p WHERE p.productPurchaseHistoryEntityId.organizationId = :organizationId AND p.productPurchaseHistoryEntityId.productName = :productName ORDER BY p.productPurchaseHistoryEntityId.purchaseDate DESC")
    List<ProductPurchaseHistoryEntity> getProductPrices(@Param("organizationId") String organizationID, @Param("productName") String productName);

    @Query("SELECT p FROM ProductPurchaseHistoryEntity p WHERE p.productPurchaseHistoryEntityId.organizationId = :organizationId AND p.productPurchaseHistoryEntityId.productName IN :productNames ORDER BY p.productPurchaseHistoryEntityId.purchaseDate DESC")
    List<ProductPurchaseHistoryEntity> getProductQuantities(@Param("organizationId") String organizationID, @Param("productNames") List<String> productNames);
}
