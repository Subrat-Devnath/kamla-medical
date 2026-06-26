package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.InvoiceEntity;
import com.product.mgmt.repository.entity.InvoiceEntityId;
import com.product.mgmt.repository.entity.ProductEntity;
import com.product.mgmt.repository.entity.ProductEntityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceDAO extends JpaRepository<InvoiceEntity, InvoiceEntityId> {


}
