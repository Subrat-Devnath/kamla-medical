package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.InvoiceEntity;
import com.product.mgmt.repository.entity.InvoiceEntityId;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceDAO extends JpaRepository<InvoiceEntity, InvoiceEntityId> {

    Page<InvoiceEntity> findByInvoiceEntityIdOrganizationId(String organizationId, Pageable pageable);

    @Query("SELECT invoiceEntity FROM InvoiceEntity invoiceEntity " +
            "WHERE invoiceEntity.invoiceEntityId.organizationId = :organizationId " +
            "AND invoiceEntity.customerName >= :start " +
            "AND invoiceEntity.customerName < :end")
    Page<InvoiceEntity> searchInvoiceWithPagination(
            @Param("organizationId") String organizationId,
            @Param("start") String start,
            @Param("end") String end,
            Pageable pageable);
}
