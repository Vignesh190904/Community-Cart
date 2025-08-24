-- ========================================
-- COMMUNITY CART DATABASE SETUP
-- ========================================
-- Run this script in Supabase SQL Editor to set up the complete database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CORE TABLES
-- ========================================

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, shop_name)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    block VARCHAR(50),
    flat VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, name)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'COD' CHECK (payment_method IN ('COD', 'ONLINE', 'CARD')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    delivery_address TEXT,
    delivery_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Communities indexes
CREATE INDEX IF NOT EXISTS idx_communities_name ON communities(name);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_community_id ON vendors(community_id);
CREATE INDEX IF NOT EXISTS idx_vendors_shop_name ON vendors(shop_name);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_community_id ON customers(community_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Admins indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_community_id ON categories(community_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert sample community
INSERT INTO communities (name, address) VALUES 
('Sunset Gardens', '123 Sunset Boulevard, City Center')
ON CONFLICT (name) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (community_id, name) VALUES 
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Groceries'),
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Electronics'),
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Clothing')
ON CONFLICT (community_id, name) DO NOTHING;

-- Insert sample vendor
INSERT INTO vendors (community_id, name, shop_name, phone) VALUES 
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'John Doe', 'Sunset Mart', '+1234567890')
ON CONFLICT (community_id, shop_name) DO NOTHING;

-- Insert sample customer
INSERT INTO customers (community_id, name, phone, block, flat) VALUES 
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Jane Smith', '+0987654321', 'A', '101')
ON CONFLICT (community_id, name) DO NOTHING;

-- Insert sample products
INSERT INTO products (vendor_id, category_id, name, description, price, stock, available) VALUES 
((SELECT id FROM vendors WHERE shop_name = 'Sunset Mart'), 
 (SELECT id FROM categories WHERE name = 'Groceries'), 
 'Fresh Apples', 'Organic red apples', 2.99, 50, true),
((SELECT id FROM vendors WHERE shop_name = 'Sunset Mart'), 
 (SELECT id FROM categories WHERE name = 'Electronics'), 
 'USB Cable', 'High-quality USB-C cable', 15.99, 25, true)
ON CONFLICT DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Communities policies
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
CREATE POLICY "Communities are viewable by everyone" ON communities
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage communities" ON communities;
CREATE POLICY "Only admins can manage communities" ON communities
    FOR ALL USING (true);

-- Vendors policies
DROP POLICY IF EXISTS "Vendors are viewable by community members" ON vendors;
CREATE POLICY "Vendors are viewable by community members" ON vendors
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vendors can manage their own data" ON vendors;
CREATE POLICY "Vendors can manage their own data" ON vendors
    FOR ALL USING (true);

-- Customers policies
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can manage their own data" ON customers;
CREATE POLICY "Customers can manage their own data" ON customers
    FOR ALL USING (true);

-- Admins policies
DROP POLICY IF EXISTS "Admins can manage all data" ON admins;
CREATE POLICY "Admins can manage all data" ON admins
    FOR ALL USING (true);

-- Categories policies
DROP POLICY IF EXISTS "Categories are viewable by community members" ON categories;
CREATE POLICY "Categories are viewable by community members" ON categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (true);

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by community members" ON products;
CREATE POLICY "Products are viewable by community members" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vendors can manage their own products" ON products;
CREATE POLICY "Vendors can manage their own products" ON products
    FOR ALL USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vendors can view orders for their shop" ON orders;
CREATE POLICY "Vendors can view orders for their shop" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Vendors can update order status" ON orders;
CREATE POLICY "Vendors can update order status" ON orders
    FOR UPDATE USING (true);

-- Order items policies
DROP POLICY IF EXISTS "Order items are viewable by order participants" ON order_items;
CREATE POLICY "Order items are viewable by order participants" ON order_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Order items can be created with orders" ON order_items;
CREATE POLICY "Order items can be created with orders" ON order_items
    FOR INSERT WITH CHECK (true);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if tables were created
SELECT 
    'Tables Created' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('communities', 'vendors', 'customers', 'admins', 'categories', 'products', 'orders', 'order_items');

-- Check sample data
SELECT 
    'Sample Data' as status,
    (SELECT COUNT(*) FROM communities) as communities_count,
    (SELECT COUNT(*) FROM vendors) as vendors_count,
    (SELECT COUNT(*) FROM customers) as customers_count,
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM products) as products_count;

-- ========================================
-- NEXT STEPS
-- ========================================
-- 
-- After running this script:
-- 1. Create admin user in Supabase Auth (see ADMIN_SETUP.md)
-- 2. Test the backend endpoints
-- 3. Verify Admin Portal functionality
