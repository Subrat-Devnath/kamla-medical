package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.*;
import com.security.config.utils.SecurityUtil;
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
public interface InvoiceItemDAO extends JpaRepository<InvoiceItemEntity, InvoiceItemEntityId> {

    @Query(" SELECT i FROM InvoiceItemEntity i WHERE i.id.organizationId = :organizationId AND i.id.invoiceNumber = :invoiceNumber")
    List<InvoiceItemEntity> findByIdOrganizationIdAndIdInvoiceNumber(@Param("organizationId") String organizationId, @Param("invoiceNumber") String invoiceNumber);

    Page<InvoiceItemEntity> findByInvoiceItemEntityIdOrganizationIdAndInvoiceItemEntityIdInvoiceNumber(String organizationId, String invoiceNumber, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE InvoiceItemEntity i SET i.isDeleted = true WHERE i.invoiceItemEntityId.organizationId = :organizationId AND i.invoiceItemEntityId.invoiceNumber = :invoiceNumber AND i.invoiceItemEntityId.invoiceItemId = :invoiceItemId")
    int softDeleteInvoiceItem(@Param("organizationId") String organizationId, @Param("invoiceNumber") String invoiceNumber, @Param("invoiceItemId") String invoiceItemId);
}
