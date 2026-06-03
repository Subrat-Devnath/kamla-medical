package com.product.mgmt.repository.dao;

import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntity;
import com.product.mgmt.repository.entity.ProductPurchaseHistoryEntityId;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.List;

public interface ProductPurchaseHistoryDAO extends CassandraRepository<ProductPurchaseHistoryEntity, ProductPurchaseHistoryEntityId> {

    @Query("select * from product_purchase_history where organization_id = ?0 and product_name = ?1")
    List<ProductPurchaseHistoryEntity> getProductPrices(String organizationID, String productName);

    @Query("select organization_id, product_name, purchased_quantity, remaining_quantity, sold_quantity, is_deleted from product_purchase_history where organization_id = ?0 and product_name in ?1")
    List<ProductPurchaseHistoryEntity> getProductQuantities(String organizationID, List<String> productNames);
}
