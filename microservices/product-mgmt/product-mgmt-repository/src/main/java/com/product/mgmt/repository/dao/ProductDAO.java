package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDAO extends JpaRepository<ProductEntity, ProductEntityId> {

    @Query("SELECT p FROM ProductEntity p WHERE p.productEntityId.organizationId = :organizationId AND p.productEntityId.productName = :productName")
    ProductEntity getProduct(@Param("organizationId") String organizationID, @Param("productName") String productName);

    @Query("SELECT p FROM ProductEntity p WHERE p.productEntityId.organizationId = :organizationId AND p.productEntityId.productName >= :start AND p.productEntityId.productName < :end")
    List<ProductEntity> searchProducts(@Param("organizationId") String organizationId, @Param("start") String start, @Param("end") String end);

    Page<ProductEntity> findByProductEntityIdOrganizationId(String organizationId, Pageable pageable);

    @Query("SELECT p FROM ProductEntity p WHERE p.productEntityId.organizationId = :organizationId AND p.productEntityId.productName >= :start AND p.productEntityId.productName < :end")
    Page<ProductEntity> searchProductsWithPagination(@Param("organizationId") String organizationId, @Param("start") String start, @Param("end") String end, Pageable pageable);

    @Query("SELECT p.productQuantity FROM ProductEntity p WHERE p.productEntityId.organizationId = :organizationId AND p.productEntityId.productName = :productName")
    Long getProductQuantity(@Param("organizationId") String organizationId, @Param("productName") String productName);
}
