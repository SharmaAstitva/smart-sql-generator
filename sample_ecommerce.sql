-- ============================================================
-- sample_ecommerce.sql
-- A sample e-commerce database for testing Smart SQL Generator
-- ============================================================

CREATE TABLE IF NOT EXISTS `customers` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(200) UNIQUE NOT NULL,
  `city`       VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(200) NOT NULL,
  `category`    VARCHAR(100),
  `price`       DECIMAL(10,2) NOT NULL,
  `stock`       INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `orders` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `status`      ENUM('pending','shipped','delivered','cancelled') DEFAULT 'pending',
  `total`       DECIMAL(10,2),
  `ordered_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`)
);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `order_id`   INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity`   INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`)   REFERENCES `orders`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
);

-- ── Sample Data ──────────────────────────────────────────────

INSERT INTO `customers` (`name`, `email`, `city`) VALUES
  ('Alice Johnson',  'alice@example.com',  'New York'),
  ('Bob Smith',      'bob@example.com',    'Los Angeles'),
  ('Carol White',    'carol@example.com',  'Chicago'),
  ('David Brown',    'david@example.com',  'New York'),
  ('Eve Davis',      'eve@example.com',    NULL);  -- customer with no city

INSERT INTO `products` (`name`, `category`, `price`, `stock`) VALUES
  ('Laptop Pro 15',   'Electronics', 1299.99, 50),
  ('Wireless Mouse',  'Electronics',   29.99, 200),
  ('Desk Chair',      'Furniture',    349.99, 30),
  ('Coffee Mug',      'Kitchen',        9.99, 500),
  ('USB-C Hub',       'Electronics',   59.99, 150);

INSERT INTO `orders` (`customer_id`, `status`, `total`, `ordered_at`) VALUES
  (1, 'delivered', 1329.98, '2024-01-10 10:00:00'),
  (1, 'shipped',     59.99, '2024-02-15 14:30:00'),
  (2, 'delivered',  349.99, '2024-01-20 09:00:00'),
  (3, 'pending',     39.98, '2024-03-01 11:00:00'),
  (1, 'delivered',   29.99, '2024-03-05 16:00:00');

INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `unit_price`) VALUES
  (1, 1, 1, 1299.99),
  (1, 2, 1,   29.99),
  (2, 5, 1,   59.99),
  (3, 3, 1,  349.99),
  (4, 4, 2,    9.99),
  (4, 2, 1,   19.99),
  (5, 2, 1,   29.99);
