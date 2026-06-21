-- MySQL Migration for Product Purchase History Table
-- This replaces the Cassandra product_purchase_history table with MySQL equivalent

CREATE TABLE IF NOT EXISTS `product_purchase_history` (
    `organization_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `supplier_name` VARCHAR(255) NOT NULL,
    `purchase_date` BIGINT NOT NULL,

    `unit_list_price` DOUBLE,
    `total_list_price` DOUBLE,

    `unit_buy_price` DOUBLE,
    `total_buy_price` DOUBLE,

    `buy_discount` DOUBLE,

    `purchased_quantity` BIGINT,
    `remaining_quantity` BIGINT,
    `sold_quantity` BIGINT,

    `is_deleted` BOOLEAN DEFAULT FALSE,
    `expiry_date` BIGINT,
    `is_expired` BOOLEAN DEFAULT FALSE,

    `created_date` BIGINT NOT NULL,
    `created_user_id` VARCHAR(255),
    `created_user_name` VARCHAR(255),

    `updated_date` BIGINT,
    `updated_user_id` VARCHAR(255),
    `updated_user_name` VARCHAR(255),

    PRIMARY KEY (`organization_id`, `user_id`, `product_name`, `supplier_name`, `purchase_date`),
    INDEX idx_org_product (`organization_id`, user_id, `product_name`),
    INDEX idx_purchase_date (`purchase_date`),
    INDEX idx_is_deleted (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
