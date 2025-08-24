-- Migration: Vendor Analytics and Real Data Tables
-- Description: Add tables and columns for real vendor analytics, orders, and metrics
-- Date: 2025-01-20

-- ========================================
-- CREATE ORDERS TABLE (if not exists)
-- ========================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    delivery_address TEXT,
    notes TEXT,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- CREATE ORDER_ITEMS TABLE (if not exists)
-- ========================================

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- CREATE CUSTOMERS TABLE (if not exists)
-- ========================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- ADD MISSING COLUMNS TO VENDORS TABLE
-- ========================================

ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0 CHECK (total_orders >= 0),
ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(12,2) DEFAULT 0 CHECK (total_revenue >= 0),
ADD COLUMN IF NOT EXISTS vendor_since DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- ========================================
-- ADD MISSING COLUMNS TO PRODUCTS TABLE
-- ========================================

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL DEFAULT 'Unnamed Product',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0 CHECK (stock >= 0),
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- ========================================
-- CREATE CATEGORIES TABLE (if not exists)
-- ========================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, name)
);

-- ========================================
-- CREATE VENDOR_METRICS VIEW FOR ANALYTICS
-- ========================================

CREATE OR REPLACE VIEW vendor_metrics AS
SELECT 
    v.id as vendor_id,
    v.name,
    v.shop_name,
    v.rating,
    v.vendor_since,
    v.status,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT CASE WHEN p.available = true THEN p.id END) as active_products,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders,
    COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as total_revenue,
    COALESCE(AVG(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as avg_order_value,
    COALESCE(SUM(CASE WHEN o.status = 'completed' THEN (o.total_amount * 0.1) END), 0) as total_profit
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name, v.shop_name, v.rating, v.vendor_since, v.status;

-- ========================================
-- CREATE MONTHLY_REVENUE VIEW FOR TRENDS
-- ========================================

CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    v.id as vendor_id,
    DATE_TRUNC('month', o.created_at) as month,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total_amount), 0) as revenue,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value
FROM vendors v
LEFT JOIN orders o ON v.id = o.vendor_id AND o.status = 'completed'
WHERE o.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY v.id, DATE_TRUNC('month', o.created_at)
ORDER BY v.id, month;

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_orders_vendor_id_status ON orders(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_status ON orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX IF NOT EXISTS idx_customers_community_id ON customers(community_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor_available ON products(vendor_id, available);

-- ========================================
-- UPDATE TRIGGERS FOR UPDATED_AT
-- ========================================

-- Add triggers for new tables
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Orders policies
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
CREATE POLICY "Service role can manage orders" ON orders FOR ALL USING (true);

-- Order items policies  
DROP POLICY IF EXISTS "Service role can manage order items" ON order_items;
CREATE POLICY "Service role can manage order items" ON order_items FOR ALL USING (true);

-- Customers policies
DROP POLICY IF EXISTS "Service role can manage customers" ON customers;
CREATE POLICY "Service role can manage customers" ON customers FOR ALL USING (true);

-- ========================================
-- SEED SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample customers
INSERT INTO customers (id, name, phone, address) VALUES
(gen_random_uuid(), 'John Doe', '+91-9876543210', '123 Main St, Mumbai'),
(gen_random_uuid(), 'Jane Smith', '+91-9876543211', '456 Oak Ave, Delhi'),
(gen_random_uuid(), 'Bob Johnson', '+91-9876543212', '789 Pine Rd, Bangalore')
ON CONFLICT (id) DO NOTHING;

-- Insert sample categories (if communities exist)
INSERT INTO categories (community_id, name, description)
SELECT c.id, cat.name, cat.description
FROM communities c
CROSS JOIN (VALUES 
    ('Vegetables', 'Fresh vegetables and greens'),
    ('Fruits', 'Fresh seasonal fruits'),
    ('Dairy', 'Milk, cheese, yogurt and dairy products'),
    ('Bakery', 'Bread, cakes and baked goods'),
    ('Spices', 'Spices and herbs')
) AS cat(name, description)
ON CONFLICT (community_id, name) DO NOTHING;

-- Update existing vendors with sample data
UPDATE vendors 
SET 
    rating = 4.0 + (RANDOM() * 1.0),
    vendor_since = CURRENT_DATE - (RANDOM() * 365)::INTEGER,
    status = 'active'
WHERE rating IS NULL;

-- Insert sample products for existing vendors
INSERT INTO products (vendor_id, category_id, name, price, stock, available)
SELECT 
    v.id,
    c.id,
    prod.name,
    (10 + RANDOM() * 90)::DECIMAL(10,2),
    (5 + RANDOM() * 95)::INTEGER,
    true
FROM vendors v
CROSS JOIN categories c
CROSS JOIN (VALUES 
    ('Fresh Tomatoes'),
    ('Organic Carrots'),
    ('Green Leafy Vegetables'),
    ('Fresh Milk'),
    ('Homemade Bread')
) AS prod(name)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE vendor_id = v.id)
LIMIT 50
ON CONFLICT DO NOTHING;

-- Insert sample orders for the last 6 months
INSERT INTO orders (vendor_id, customer_id, status, total_amount, customer_name, customer_phone, order_date)
SELECT 
    v.id,
    c.id,
    CASE 
        WHEN RANDOM() < 0.7 THEN 'completed'
        WHEN RANDOM() < 0.9 THEN 'pending'
        ELSE 'cancelled'
    END,
    (50 + RANDOM() * 500)::DECIMAL(10,2),
    c.name,
    c.phone,
    CURRENT_DATE - (RANDOM() * 180)::INTEGER
FROM vendors v
CROSS JOIN customers c
WHERE RANDOM() < 0.3  -- 30% chance to create order for each vendor-customer pair
LIMIT 200;

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    (1 + RANDOM() * 5)::INTEGER,
    p.price,
    p.price * (1 + RANDOM() * 5)::INTEGER
FROM orders o
CROSS JOIN products p
WHERE p.vendor_id = o.vendor_id
AND RANDOM() < 0.4  -- 40% chance for each product to be in an order
LIMIT 500;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE orders IS 'Customer orders placed with vendors';
COMMENT ON TABLE order_items IS 'Individual items within an order';
COMMENT ON TABLE customers IS 'Customer information and profiles';
COMMENT ON VIEW vendor_metrics IS 'Comprehensive vendor analytics and metrics';
COMMENT ON VIEW monthly_revenue IS 'Monthly revenue trends for vendors';

-- Migration completed successfully
