-- MySQL Migration for Product Table
-- This replaces the Cassandra product table with MySQL equivalent

CREATE TABLE IF NOT EXISTS `product` (
    `organization_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `formula` VARCHAR(255) NOT NULL,
    `product_quantity` BIGINT,
    `category` VARCHAR(255),
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `is_expired` BOOLEAN DEFAULT FALSE,
    `expiry_date` BIGINT,
    `created_date` BIGINT NOT NULL,
    `created_user_name` VARCHAR(255),
    `created_user_id` VARCHAR(255),
    `updated_date` BIGINT,
    `updated_user_name` VARCHAR(255),
    `updated_user_id` VARCHAR(255),
    PRIMARY KEY (`organization_id`, `user_id`, `product_name`),
    INDEX idx_organization_id (`organization_id`),
    INDEX idx_user_id (`user_id`),
    INDEX idx_product_name (`product_name`),
    INDEX idx_is_deleted (`is_deleted`),
    INDEX idx_expiry_date (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
