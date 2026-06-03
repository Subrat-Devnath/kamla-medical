-- MySQL Migration for Refresh Token Table
-- This replaces the Cassandra refresh_token table with MySQL equivalent

CREATE TABLE IF NOT EXISTS `refresh_token` (
    `token_id` BINARY(16) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `created_at` INT,
    `expired_at` INT,
    `revoked` BOOLEAN DEFAULT FALSE,
    `replaced_token` VARCHAR(1024),
    PRIMARY KEY (`token_id`),
    INDEX idx_user_id (`user_id`),
    INDEX idx_revoked (`revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
