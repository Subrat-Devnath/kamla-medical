package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.InvoiceItemEntity;
import com.product.mgmt.repository.entity.InvoiceItemEntityId;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import com.security.config.utils.SecurityUtil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceItemDAO extends JpaRepository<InvoiceItemEntity, InvoiceItemEntityId> {

    @Query(" SELECT i FROM InvoiceItemEntity i WHERE i.id.organizationId = :organizationId AND i.id.invoiceNumber = :invoiceNumber")
    List<InvoiceItemEntity> findByIdOrganizationIdAndIdInvoiceNumber(@Param("organizationId") String organizationId, @Param("invoiceNumber") String invoiceNumber);
}
