package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductDAO extends JpaRepository<ProductEntity, ProductEntityId> {

    @Query("SELECT productEntity FROM ProductEntity productEntity WHERE productEntity.productEntityId.organizationId = :organizationId AND productEntity.productEntityId.userId = :userId AND productEntity.productEntityId.productName = :productName")
    ProductEntity getProduct(@Param("organizationId") String organizationID, @Param("userId") String userId, @Param("productName") String productName);

    @Query("SELECT productEntity FROM ProductEntity productEntity WHERE productEntity.productEntityId.organizationId = :organizationId AND productEntity.productEntityId.userId = :userId AND productEntity.productEntityId.productName IN :productNames")
    List<ProductEntity> getProducts(@Param("organizationId") String organizationID, @Param("userId") String userId, @Param("productNames") List<String> productNames);

    @Query("SELECT productEntity FROM ProductEntity productEntity WHERE productEntity.productEntityId.organizationId = :organizationId AND  productEntity.productEntityId.userId = :userId AND productEntity.productEntityId.productName >= :start AND productEntity.productEntityId.productName < :end")
    List<ProductEntity> searchProducts(@Param("organizationId") String organizationId, @Param("userId") String userId, @Param("start") String start, @Param("end") String end);

    Page<ProductEntity> findByProductEntityIdOrganizationIdAndProductEntityIdUserId(String organizationId, String userId, Pageable pageable);

    @Query("SELECT productEntity FROM ProductEntity productEntity " +
            "WHERE productEntity.productEntityId.organizationId = :organizationId " +
            "AND productEntity.productEntityId.userId = :userId " +
            "AND ( " +
            "      (productEntity.productEntityId.productName >= :start AND productEntity.productEntityId.productName < :end) " +
            "      OR " +
            "      (productEntity.formula >= :start AND productEntity.formula < :end) " +
            "    )")
    Page<ProductEntity> searchProductsWithPagination(
            @Param("organizationId") String organizationId,
            @Param("userId") String userId,
            @Param("start") String start,
            @Param("end") String end,
            Pageable pageable);

    @Query("SELECT productEntity.productQuantity FROM ProductEntity productEntity WHERE productEntity.productEntityId.organizationId = :organizationId AND productEntity.productEntityId.userId = :userId AND productEntity.productEntityId.productName = :productName")
    Long getProductQuantity(@Param("organizationId") String organizationId, @Param("userId") String userId, @Param("productName") String productName);

    @Modifying
    @Transactional
    @Query("UPDATE ProductEntity p SET p.isDeleted = true WHERE p.productEntityId.organizationId = :organizationId AND p.productEntityId.userId = :userId AND p.productEntityId.productName IN :productNames")
    int softDeleteProduct(String organizationId, String userId, List<String> productNames);

}
