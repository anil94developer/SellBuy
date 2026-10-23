-- SellBuy MySQL Database Schema
-- Database Name: sellbuyer

CREATE DATABASE IF NOT EXISTS `sellbuyer` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sellbuyer`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(150) NULL,
  `password_hash` VARCHAR(255) NULL,
  `avatar` VARCHAR(500) NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `status` ENUM('active', 'blocked') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `logo_icon` VARCHAR(255) NULL,
  `is_popular` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Car Models Table
CREATE TABLE IF NOT EXISTS `car_models` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `brand_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `body_type` VARCHAR(50) DEFAULT 'SUV',
  INDEX idx_brand (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Cities Table
CREATE TABLE IF NOT EXISTS `cities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `state` VARCHAR(100) NOT NULL,
  `is_popular` BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Car Listings Table
CREATE TABLE IF NOT EXISTS `car_listings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `brand_id` INT NOT NULL,
  `model_name` VARCHAR(100) NOT NULL,
  `manufacturing_year` INT NOT NULL,
  `reg_year` INT NOT NULL,
  `reg_city` VARCHAR(100) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `km_driven` INT NOT NULL,
  `fuel_type` ENUM('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid') NOT NULL,
  `transmission` ENUM('Manual', 'Automatic') NOT NULL,
  `ownership` VARCHAR(50) DEFAULT '1st Owner',
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `status` ENUM('pending', 'active', 'sold', 'rejected') DEFAULT 'active',
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_certified` BOOLEAN DEFAULT FALSE,
  `views_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (`status`),
  INDEX idx_brand (`brand_id`),
  INDEX idx_price (`price`),
  INDEX idx_city (`reg_city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Car Images Table
CREATE TABLE IF NOT EXISTS `car_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `listing_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  INDEX idx_listing (`listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Favorites Table
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `listing_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_fav (`user_id`, `listing_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Chats Table
CREATE TABLE IF NOT EXISTS `chats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `listing_id` INT NOT NULL,
  `buyer_id` INT NOT NULL,
  `seller_id` INT NOT NULL,
  `last_message` VARCHAR(500),
  `last_message_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_chat (`listing_id`, `buyer_id`, `seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Chat Messages Table
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chat_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `message_text` TEXT NOT NULL,
  `attachment_url` VARCHAR(500) NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('all', 'messages', 'listings', 'price_alert', 'system') DEFAULT 'all',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_name` VARCHAR(100) NULL,
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `level` ENUM('INFO', 'WARN', 'ERROR', 'AUTH', 'CAR', 'ADMIN') DEFAULT 'INFO',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (`created_at`),
  INDEX idx_module (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
