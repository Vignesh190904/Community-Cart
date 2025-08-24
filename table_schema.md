# 📊 Community Cart - Complete Database Schema Documentation

## 🎯 Overview

This document provides comprehensive documentation of all database tables, columns, relationships, constraints, indexes, views, and security policies for the Community Cart platform using Supabase PostgreSQL.

---

## 📋 Table of Contents

1. [Core Tables](#core-tables)
2. [Relationships Overview](#relationships-overview)
3. [Indexes](#indexes)
4. [Views](#views)
5. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
6. [Functions & Triggers](#functions--triggers)
7. [Sample Data](#sample-data)

---

## 🏗️ Core Tables

### 1. `communities` Table

**Purpose**: Stores information about different communities/neighborhoods where vendors operate.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each community |
| `name` | `VARCHAR(255)` | `NOT NULL` | Name of the community/neighborhood |
| `address` | `TEXT` | `NOT NULL` | Physical address of the community |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: None
**Unique Constraints**: None
**Check Constraints**: None

---

### 2. `vendors` Table

**Purpose**: Stores vendor/shop owner information with enhanced fields for admin portal management.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each vendor |
| `community_id` | `UUID` | `FOREIGN KEY REFERENCES communities(id) ON DELETE CASCADE` | Reference to the community where vendor operates |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of the vendor/shop owner |
| `email` | `VARCHAR(255)` | `NULL` | Email address of the vendor |
| `shop_name` | `VARCHAR(255)` | `NOT NULL` | Name of the shop/business |
| `phone` | `VARCHAR(20)` | `NULL` | Phone number of the vendor |
| `business_name` | `VARCHAR(255)` | `NULL` | Official business/company name |
| `category` | `VARCHAR(50)` | `CHECK (category IN ('vegetables', 'grocery', 'bakery', 'food', 'general'))` | Business category |
| `address` | `TEXT` | `NULL` | Business address |
| `description` | `TEXT` | `NULL` | Business description |
| `rating` | `DECIMAL(3,2)` | `DEFAULT 4.0`, `CHECK (rating >= 0 AND rating <= 5)` | Average customer rating |
| `total_orders` | `INTEGER` | `DEFAULT 0` | Total number of orders received |
| `total_revenue` | `DECIMAL(12,2)` | `DEFAULT 0.00` | Total revenue generated |
| `status` | `BOOLEAN` | `DEFAULT true` | Active/inactive status |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: 
- `community_id` → `communities(id)` ON DELETE CASCADE
**Unique Constraints**: 
- `UNIQUE(community_id, shop_name)` - Prevents duplicate shop names within same community
**Check Constraints**:
- `category IN ('vegetables', 'grocery', 'bakery', 'food', 'general')`
- `rating >= 0 AND rating <= 5`

---

### 3. `customers` Table

**Purpose**: Stores customer information for order management.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each customer |
| `community_id` | `UUID` | `FOREIGN KEY REFERENCES communities(id) ON DELETE CASCADE` | Reference to customer's community |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of the customer |
| `phone` | `VARCHAR(20)` | `NULL` | Phone number of the customer |
| `address` | `TEXT` | `NULL` | Full address of the customer |
| `block` | `VARCHAR(50)` | `NULL` | Block/building information |
| `flat` | `VARCHAR(50)` | `NULL` | Flat/apartment number |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: 
- `community_id` → `communities(id)` ON DELETE CASCADE
**Unique Constraints**: None
**Check Constraints**: None

---

### 4. `admins` Table

**Purpose**: Stores admin user information for portal authentication.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each admin |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of the admin |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Email address (used for login) |
| `phone` | `VARCHAR(20)` | `NULL` | Phone number of the admin |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Hashed password or placeholder for Supabase Auth |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: None
**Unique Constraints**: 
- `UNIQUE(email)` - Ensures unique email addresses
**Check Constraints**: None

---

### 5. `categories` Table

**Purpose**: Stores product categories specific to each community.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each category |
| `community_id` | `UUID` | `FOREIGN KEY REFERENCES communities(id) ON DELETE CASCADE` | Reference to the community |
| `name` | `VARCHAR(255)` | `NOT NULL` | Name of the category |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: 
- `community_id` → `communities(id)` ON DELETE CASCADE
**Unique Constraints**: 
- `UNIQUE(community_id, name)` - Prevents duplicate categories within same community
**Check Constraints**: None

---

### 6. `products` Table

**Purpose**: Stores product information offered by vendors.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each product |
| `vendor_id` | `UUID` | `FOREIGN KEY REFERENCES vendors(id) ON DELETE CASCADE` | Reference to the vendor selling this product |
| `category_id` | `UUID` | `FOREIGN KEY REFERENCES categories(id) ON DELETE CASCADE` | Reference to the product category |
| `name` | `VARCHAR(255)` | `NOT NULL` | Name of the product |
| `description` | `TEXT` | `NULL` | Detailed description of the product |
| `price` | `DECIMAL(10,2)` | `NOT NULL`, `CHECK (price >= 0)` | Price per unit |
| `stock` | `INTEGER` | `NOT NULL`, `DEFAULT 0`, `CHECK (stock >= 0)` | Available stock quantity |
| `unit` | `VARCHAR(20)` | `DEFAULT 'piece'` | Unit of measurement (kg, piece, liter, etc.) |
| `available` | `BOOLEAN` | `DEFAULT true` | Product availability status |
| `image_url` | `TEXT` | `NULL` | URL to product image |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: 
- `vendor_id` → `vendors(id)` ON DELETE CASCADE
- `category_id` → `categories(id)` ON DELETE CASCADE
**Unique Constraints**: None
**Check Constraints**:
- `price >= 0`
- `stock >= 0`

---

### 7. `orders` Table

**Purpose**: Stores order information placed by customers.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each order |
| `customer_id` | `UUID` | `FOREIGN KEY REFERENCES customers(id) ON DELETE CASCADE` | Reference to the customer placing the order |
| `vendor_id` | `UUID` | `FOREIGN KEY REFERENCES vendors(id) ON DELETE CASCADE` | Reference to the vendor fulfilling the order |
| `total_amount` | `DECIMAL(10,2)` | `NOT NULL`, `CHECK (total_amount >= 0)` | Total order amount |
| `payment_method` | `VARCHAR(50)` | `DEFAULT 'COD'`, `CHECK (payment_method IN ('COD', 'ONLINE', 'CARD'))` | Payment method used |
| `status` | `VARCHAR(50)` | `DEFAULT 'pending'`, `CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'completed'))` | Current order status |
| `delivery_address` | `TEXT` | `NULL` | Delivery address for the order |
| `delivery_instructions` | `TEXT` | `NULL` | Special delivery instructions |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT now()`, `NOT NULL` | Record creation timestamp |

**Primary Key**: `id`
**Foreign Keys**: 
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `vendor_id` → `vendors(id)` ON DELETE CASCADE
**Unique Constraints**: None
**Check Constraints**:
- `total_amount >= 0`
- `payment_method IN ('COD', 'ONLINE', 'CARD')`
- `status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'completed')`

---

### 8. `order_items` Table

**Purpose**: Stores individual items within each order.

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for each order item |
| `order_id` | `UUID` | `FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE` | Reference to the order |
| `product_id` | `UUID` | `FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE` | Reference to the product |
| `quantity` | `INTEGER` | `NOT NULL`, `CHECK (quantity > 0)` | Quantity of the product ordered |
| `unit_price` | `DECIMAL(10,2)` | `NOT NULL`, `CHECK (unit_price >= 0)` | Price per unit at time of order |
| `total_price` | `DECIMAL(10,2)` | `NOT NULL`, `CHECK (total_price >= 0)` | Total price for this item (quantity × unit_price) |

**Primary Key**: `id`
**Foreign Keys**: 
- `order_id` → `orders(id)` ON DELETE CASCADE
- `product_id` → `products(id)` ON DELETE CASCADE
**Unique Constraints**: None
**Check Constraints**:
- `quantity > 0`
- `unit_price >= 0`
- `total_price >= 0`

---

## 🔗 Relationships Overview

### Entity Relationship Diagram (ERD) Description

```
communities (1) ←→ (M) vendors
communities (1) ←→ (M) customers
communities (1) ←→ (M) categories

vendors (1) ←→ (M) products
vendors (1) ←→ (M) orders

customers (1) ←→ (M) orders

categories (1) ←→ (M) products

orders (1) ←→ (M) order_items
products (1) ←→ (M) order_items

admins (standalone - no direct relationships)
```

### Detailed Relationships

1. **Community → Vendors**: One-to-Many
   - One community can have multiple vendors
   - Each vendor belongs to one community

2. **Community → Customers**: One-to-Many
   - One community can have multiple customers
   - Each customer belongs to one community

3. **Community → Categories**: One-to-Many
   - One community can have multiple product categories
   - Each category belongs to one community

4. **Vendor → Products**: One-to-Many
   - One vendor can sell multiple products
   - Each product is sold by one vendor

5. **Vendor → Orders**: One-to-Many
   - One vendor can receive multiple orders
   - Each order is placed with one vendor

6. **Customer → Orders**: One-to-Many
   - One customer can place multiple orders
   - Each order is placed by one customer

7. **Category → Products**: One-to-Many
   - One category can contain multiple products
   - Each product belongs to one category

8. **Order → Order Items**: One-to-Many
   - One order can contain multiple items
   - Each order item belongs to one order

9. **Product → Order Items**: One-to-Many
   - One product can appear in multiple order items
   - Each order item references one product

---

## 📇 Indexes

### Performance Indexes

```sql
-- Community-based lookups
CREATE INDEX IF NOT EXISTS idx_vendors_community_id ON vendors(community_id);
CREATE INDEX IF NOT EXISTS idx_customers_community_id ON customers(community_id);
CREATE INDEX IF NOT EXISTS idx_categories_community_id ON categories(community_id);

-- Vendor-based lookups
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);

-- Customer-based lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Product-based lookups
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Order-based lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Status and filtering indexes
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

-- Email-based lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Time-based queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vendors_community_status ON vendors(community_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_status ON orders(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_products_vendor_available ON products(vendor_id, available);
```

---

## 📊 Views

### 1. `vendor_metrics` View

**Purpose**: Provides comprehensive metrics for each vendor.

```sql
CREATE OR REPLACE VIEW vendor_metrics AS
SELECT 
    v.id as vendor_id,
    v.name as vendor_name,
    v.shop_name,
    v.email,
    v.phone,
    v.category,
    v.rating,
    v.status,
    COALESCE(p.total_products, 0) as total_products,
    COALESCE(p.active_products, 0) as active_products,
    COALESCE(o.total_orders, 0) as total_orders,
    COALESCE(o.completed_orders, 0) as completed_orders,
    COALESCE(o.total_revenue, 0) as total_revenue,
    CASE 
        WHEN COALESCE(o.completed_orders, 0) > 0 
        THEN COALESCE(o.total_revenue, 0) / o.completed_orders 
        ELSE 0 
    END as avg_order_value,
    COALESCE(o.total_revenue * 0.1, 0) as total_profit
FROM vendors v
LEFT JOIN (
    SELECT 
        vendor_id,
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE available = true) as active_products
    FROM products 
    GROUP BY vendor_id
) p ON v.id = p.vendor_id
LEFT JOIN (
    SELECT 
        vendor_id,
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_revenue
    FROM orders 
    GROUP BY vendor_id
) o ON v.id = o.vendor_id;
```

**Columns**:
- `vendor_id`, `vendor_name`, `shop_name`, `email`, `phone`, `category`, `rating`, `status`
- `total_products`, `active_products`
- `total_orders`, `completed_orders`, `total_revenue`
- `avg_order_value`, `total_profit`

### 2. `monthly_revenue` View

**Purpose**: Provides monthly revenue breakdown by vendor.

```sql
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    vendor_id,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as orders_count,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as revenue
FROM orders 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY vendor_id, DATE_TRUNC('month', created_at)
ORDER BY vendor_id, month;
```

**Columns**:
- `vendor_id`: Reference to vendor
- `month`: Month start date
- `orders_count`: Number of orders in that month
- `revenue`: Total revenue for that month

### 3. `vendor_dashboard` View

**Purpose**: Dashboard summary for individual vendor analytics.

```sql
CREATE OR REPLACE VIEW vendor_dashboard AS
SELECT 
    v.id as vendor_id,
    v.name as vendor_name,
    v.shop_name,
    COALESCE(p.total_products, 0) as total_products,
    COALESCE(p.available_products, 0) as available_products,
    COALESCE(o.total_orders, 0) as total_orders,
    COALESCE(o.pending_orders, 0) as pending_orders,
    COALESCE(o.completed_orders, 0) as completed_orders,
    COALESCE(o.total_revenue, 0) as total_revenue
FROM vendors v
LEFT JOIN (
    SELECT 
        vendor_id,
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE available = true) as available_products
    FROM products 
    GROUP BY vendor_id
) p ON v.id = p.vendor_id
LEFT JOIN (
    SELECT 
        vendor_id,
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed', 'preparing', 'ready')) as pending_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_revenue
    FROM orders 
    GROUP BY vendor_id
) o ON v.id = o.vendor_id;
```

### 4. `customer_orders` View

**Purpose**: Detailed order information with customer and vendor details.

```sql
CREATE OR REPLACE VIEW customer_orders AS
SELECT 
    o.id as order_id,
    o.total_amount,
    o.payment_method,
    o.status,
    o.delivery_address,
    o.created_at,
    c.name as customer_name,
    c.phone as customer_phone,
    v.name as vendor_name,
    v.shop_name,
    (
        SELECT json_agg(
            json_build_object(
                'product_name', p.name,
                'quantity', oi.quantity,
                'unit_price', oi.unit_price,
                'total_price', oi.total_price
            )
        )
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = o.id
    ) as items
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN vendors v ON o.vendor_id = v.id;
```

---

## 🔐 Row Level Security (RLS) Policies

### Communities Table Policies

```sql
-- Enable RLS
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage communities" ON communities
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Public read access for communities
CREATE POLICY "Public can view communities" ON communities
    FOR SELECT USING (true);
```

### Vendors Table Policies

```sql
-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage vendors" ON vendors
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Vendors can manage their own data
CREATE POLICY "Vendors can manage own data" ON vendors
    FOR ALL USING (id = auth.uid());

-- Public read access for active vendors
CREATE POLICY "Public can view active vendors" ON vendors
    FOR SELECT USING (status = true);
```

### Customers Table Policies

```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage customers" ON customers
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Customers can manage their own data
CREATE POLICY "Customers can manage own data" ON customers
    FOR ALL USING (id = auth.uid());

-- Vendors can view customers in their community
CREATE POLICY "Vendors can view community customers" ON customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = auth.uid() 
            AND vendors.community_id = customers.community_id
        )
    );
```

### Admins Table Policies

```sql
-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can manage other admins
CREATE POLICY "Admins can manage admins" ON admins
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );
```

### Products Table Policies

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Vendors can manage their own products
CREATE POLICY "Vendors can manage own products" ON products
    FOR ALL USING (vendor_id = auth.uid());

-- Public read access for available products
CREATE POLICY "Public can view available products" ON products
    FOR SELECT USING (available = true);
```

### Orders Table Policies

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage orders" ON orders
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Vendors can manage their orders
CREATE POLICY "Vendors can manage own orders" ON orders
    FOR ALL USING (vendor_id = auth.uid());

-- Customers can manage their orders
CREATE POLICY "Customers can manage own orders" ON orders
    FOR ALL USING (customer_id = auth.uid());
```

### Order Items Table Policies

```sql
-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage order items" ON order_items
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Users can access order items for their orders
CREATE POLICY "Users can access own order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.customer_id = auth.uid() OR orders.vendor_id = auth.uid())
        )
    );
```

### Categories Table Policies

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );

-- Public read access
CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

-- Vendors can create categories in their community
CREATE POLICY "Vendors can create community categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = auth.uid() 
            AND vendors.community_id = categories.community_id
        )
    );
```

---

## ⚡ Functions & Triggers

### 1. Update Order Total Function

```sql
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM order_items 
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    )
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### 2. Update Vendor Metrics Function

```sql
CREATE OR REPLACE FUNCTION update_vendor_metrics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vendors 
    SET 
        total_orders = (
            SELECT COUNT(*) 
            FROM orders 
            WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
        ),
        total_revenue = (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM orders 
            WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id) 
            AND status = 'completed'
        )
    WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### 3. Update Product Stock Function

```sql
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update stock when order status changes to 'confirmed'
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE products 
        SET stock = stock - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id 
        AND products.id = oi.product_id
        AND stock >= oi.quantity;
        
        -- Set products to unavailable if stock reaches 0
        UPDATE products 
        SET available = false
        WHERE id IN (
            SELECT oi.product_id 
            FROM order_items oi
            WHERE oi.order_id = NEW.id
        ) AND stock <= 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Trigger Definitions

```sql
-- Trigger for order total updates
CREATE TRIGGER tr_update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();

-- Trigger for vendor metrics updates
CREATE TRIGGER tr_update_vendor_metrics
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_vendor_metrics();

-- Trigger for product stock updates
CREATE TRIGGER tr_update_product_stock
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_product_stock();
```

---

## 🎯 Sample Data

### Sample Communities

```sql
INSERT INTO communities (name, address) VALUES
('Downtown Plaza', '123 Main Street, City Center, State 12345'),
('Greenfield Residency', '456 Oak Avenue, Greenfield, State 12346')
ON CONFLICT DO NOTHING;
```

### Sample Categories

```sql
INSERT INTO categories (community_id, name) 
SELECT c.id, category_name 
FROM communities c
CROSS JOIN (VALUES 
    ('Vegetables'),
    ('Fruits'), 
    ('Dairy'),
    ('Bakery'),
    ('Groceries')
) AS cat(category_name)
ON CONFLICT DO NOTHING;
```

---

## 📝 Notes

### Data Types Explanation

- **UUID**: Universally Unique Identifier for primary keys
- **VARCHAR(n)**: Variable-length character string with maximum length n
- **TEXT**: Variable-length character string with no specific length limit
- **DECIMAL(p,s)**: Exact numeric with precision p and scale s
- **INTEGER**: 32-bit signed integer
- **BOOLEAN**: True/false values
- **TIMESTAMP WITH TIME ZONE**: Date and time with timezone information

### Constraints Explanation

- **PRIMARY KEY**: Uniquely identifies each row in the table
- **FOREIGN KEY**: Links to primary key in another table
- **NOT NULL**: Column cannot contain NULL values
- **UNIQUE**: Ensures unique values across the column(s)
- **CHECK**: Enforces domain integrity through conditions
- **DEFAULT**: Provides default value when none specified

### Performance Considerations

1. **Indexes**: Created on frequently queried columns
2. **Views**: Pre-computed joins for complex analytics
3. **Triggers**: Automatic updates to maintain data consistency
4. **RLS**: Row-level security for data isolation
5. **Partitioning**: Consider partitioning large tables by date in future

---

**📊 This schema supports a complete e-commerce platform with multi-vendor, multi-community architecture, comprehensive analytics, and robust security.**
