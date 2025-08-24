-- ========================================
-- COMMUNITY CART SUPABASE SCHEMA SETUP
-- ========================================
-- This file sets up the complete database schema for the Community Cart platform
-- All statements are idempotent and can be run multiple times safely

-- Enable required extensions
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

-- Vendors table (enhanced for admin portal)
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    shop_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    business_name VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('vegetables', 'grocery', 'bakery', 'food', 'general')),
    address TEXT,
    description TEXT,
    rating DECIMAL(3,2) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, shop_name)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
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
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, name)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unit VARCHAR(20) DEFAULT 'piece',
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'COD' CHECK (payment_method IN ('COD', 'ONLINE', 'CARD')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'completed')),
    delivery_address TEXT,
    delivery_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- ADD MISSING COLUMNS (IDEMPOTENT)
-- ========================================

-- Add missing columns to vendors table
DO $$ 
BEGIN
    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'email') THEN
        ALTER TABLE vendors ADD COLUMN email VARCHAR(255);
    END IF;
    
    -- Add business_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'business_name') THEN
        ALTER TABLE vendors ADD COLUMN business_name VARCHAR(255);
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'category') THEN
        ALTER TABLE vendors ADD COLUMN category VARCHAR(50);
    END IF;
    
    -- Add address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'address') THEN
        ALTER TABLE vendors ADD COLUMN address TEXT;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'description') THEN
        ALTER TABLE vendors ADD COLUMN description TEXT;
    END IF;
    
    -- Add rating column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'rating') THEN
        ALTER TABLE vendors ADD COLUMN rating DECIMAL(3,2) DEFAULT 4.0;
    END IF;
    
    -- Add total_orders column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'total_orders') THEN
        ALTER TABLE vendors ADD COLUMN total_orders INTEGER DEFAULT 0;
    END IF;
    
    -- Add total_revenue column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'total_revenue') THEN
        ALTER TABLE vendors ADD COLUMN total_revenue DECIMAL(12,2) DEFAULT 0.00;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'status') THEN
        ALTER TABLE vendors ADD COLUMN status BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Add missing columns to customers table
DO $$ 
BEGIN
    -- Add address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'address') THEN
        ALTER TABLE customers ADD COLUMN address TEXT;
    END IF;
END $$;

-- Add missing columns to products table
DO $$ 
BEGIN
    -- Add unit column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'unit') THEN
        ALTER TABLE products ADD COLUMN unit VARCHAR(20) DEFAULT 'piece';
    END IF;
END $$;

-- Add missing columns to order_items table
DO $$ 
BEGIN
    -- Add product_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'product_name') THEN
        ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255) NOT NULL DEFAULT 'Product';
    END IF;
    
    -- Add unit_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
        ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00;
    END IF;
    
    -- Add total_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'total_price') THEN
        ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00;
    END IF;
END $$;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Communities indexes
CREATE INDEX IF NOT EXISTS idx_communities_name ON communities(name);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_community_id ON vendors(community_id);
CREATE INDEX IF NOT EXISTS idx_vendors_shop_name ON vendors(shop_name);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);

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

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
DROP POLICY IF EXISTS "Only admins can manage communities" ON communities;
DROP POLICY IF EXISTS "Vendors are viewable by community members" ON vendors;
DROP POLICY IF EXISTS "Vendors can manage their own data" ON vendors;
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
DROP POLICY IF EXISTS "Customers can manage their own data" ON customers;
DROP POLICY IF EXISTS "Admins can manage all data" ON admins;
DROP POLICY IF EXISTS "Categories are viewable by community members" ON categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Products are viewable by community members" ON products;
DROP POLICY IF EXISTS "Vendors can manage their own products" ON products;
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Vendors can view orders for their shop" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Vendors can update order status" ON orders;
DROP POLICY IF EXISTS "Order items are viewable by order participants" ON order_items;
DROP POLICY IF EXISTS "Order items can be created with orders" ON order_items;

-- Communities policies - Admin only access
CREATE POLICY "Communities are viewable by admins" ON communities
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Only admins can manage communities" ON communities
    FOR ALL USING (auth.role() = 'admin');

-- Vendors policies - Admin full access, vendors limited access
CREATE POLICY "Vendors are viewable by admins" ON vendors
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Admins can manage all vendors" ON vendors
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Vendors can view their own data" ON vendors
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Vendors can update their own data" ON vendors
    FOR UPDATE USING (auth.uid() = id);

-- Customers policies - Admin full access, customers limited access
CREATE POLICY "Customers are viewable by admins" ON customers
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Admins can manage all customers" ON customers
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can manage their own data" ON customers
    FOR ALL USING (auth.uid() = id);

-- Admins policies - Admin only access
CREATE POLICY "Admins can manage all data" ON admins
    FOR ALL USING (auth.role() = 'admin');

-- Categories policies - Admin full access, others read-only
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (auth.role() = 'admin');

-- Products policies - Admin full access, vendors limited access
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all products" ON products
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Vendors can manage their own products" ON products
    FOR ALL USING (auth.uid() = vendor_id);

-- Orders policies - Admin full access, participants limited access
CREATE POLICY "Orders are viewable by admins" ON orders
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view orders for their shop" ON orders
    FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can update order status" ON orders
    FOR UPDATE USING (auth.uid() = vendor_id);

-- Order items policies - Admin full access, participants limited access
CREATE POLICY "Order items are viewable by admins" ON order_items
    FOR SELECT USING (auth.role() = 'admin');

CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Order items are viewable by order participants" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.customer_id = auth.uid() OR orders.vendor_id = auth.uid())
        )
    );

CREATE POLICY "Order items can be created with orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.customer_id = auth.uid()
        )
    );

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- Drop existing views if they exist
DROP VIEW IF EXISTS vendor_metrics;
DROP VIEW IF EXISTS monthly_revenue;
DROP VIEW IF EXISTS vendor_dashboard;
DROP VIEW IF EXISTS customer_orders;

-- Vendor metrics view for analytics
CREATE VIEW vendor_metrics AS
SELECT 
    v.id as vendor_id,
    v.name as vendor_name,
    v.shop_name,
    v.rating,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT CASE WHEN p.available = true THEN p.id END) as active_products,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
    COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as total_revenue,
    COALESCE(AVG(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as avg_order_value,
    COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) * 0.1, 0) as total_profit
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name, v.shop_name, v.rating;

-- Monthly revenue view for charts
CREATE VIEW monthly_revenue AS
SELECT 
    v.id as vendor_id,
    DATE_TRUNC('month', o.created_at) as month,
    COUNT(o.id) as orders_count,
    COALESCE(SUM(o.total_amount), 0) as revenue
FROM vendors v
LEFT JOIN orders o ON v.id = o.vendor_id AND o.status = 'completed'
GROUP BY v.id, DATE_TRUNC('month', o.created_at)
HAVING DATE_TRUNC('month', o.created_at) IS NOT NULL;

-- Vendor dashboard view
CREATE VIEW vendor_dashboard AS
SELECT 
    v.id as vendor_id,
    v.name as vendor_name,
    v.shop_name,
    c.name as community_name,
    COUNT(p.id) as total_products,
    COUNT(CASE WHEN p.available = true THEN 1 END) as available_products,
    COUNT(o.id) as total_orders,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
    COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as total_revenue
FROM vendors v
JOIN communities c ON v.community_id = c.id
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name, v.shop_name, c.name;

-- Customer orders view
CREATE VIEW customer_orders AS
SELECT 
    o.id as order_id,
    o.total_amount,
    o.status,
    o.payment_method,
    o.created_at,
    c.name as customer_name,
    v.shop_name as vendor_name,
    com.name as community_name,
    STRING_AGG(p.name || ' (x' || oi.quantity || ')', ', ') as items
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN vendors v ON o.vendor_id = v.id
JOIN communities com ON c.community_id = com.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY o.id, o.total_amount, o.status, o.payment_method, o.created_at, c.name, v.shop_name, com.name;

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update order total when order items change
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_order_total ON order_items;
CREATE TRIGGER trigger_update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

-- Function to update vendor metrics when orders change
CREATE OR REPLACE FUNCTION update_vendor_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update vendor total_orders and total_revenue
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_vendor_metrics ON orders;
CREATE TRIGGER trigger_update_vendor_metrics
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_metrics();

-- Function to update product stock when order is placed
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update stock when order status changes to confirmed
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE products 
        SET stock = stock - (
            SELECT quantity 
            FROM order_items 
            WHERE order_id = NEW.id AND product_id = products.id
        )
        WHERE id IN (
            SELECT product_id 
            FROM order_items 
            WHERE order_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_product_stock ON orders;
CREATE TRIGGER trigger_update_product_stock
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- ========================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ========================================

-- Insert sample community if not exists
INSERT INTO communities (name, address) 
VALUES ('Sunset Gardens', '123 Sunset Boulevard, City Center')
ON CONFLICT DO NOTHING;

-- Insert sample categories if not exist
INSERT INTO categories (community_id, name) 
SELECT c.id, cat.name
FROM communities c
CROSS JOIN (VALUES ('Groceries'), ('Electronics'), ('Clothing'), ('General')) AS cat(name)
WHERE c.name = 'Sunset Gardens'
ON CONFLICT DO NOTHING;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE communities IS 'Communities/societies where the platform operates';
COMMENT ON TABLE vendors IS 'Shop owners and sellers within communities';
COMMENT ON TABLE customers IS 'End users who place orders';
COMMENT ON TABLE admins IS 'Platform administrators';
COMMENT ON TABLE categories IS 'Product categories for each community';
COMMENT ON TABLE products IS 'Items available for purchase';
COMMENT ON TABLE orders IS 'Customer orders with vendors';
COMMENT ON TABLE order_items IS 'Individual items within orders';

COMMENT ON COLUMN orders.payment_method IS 'Payment method: COD (Cash on Delivery), ONLINE, CARD';
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, preparing, ready, delivered, cancelled, completed';
COMMENT ON COLUMN products.available IS 'Whether the product is currently available for purchase';
COMMENT ON COLUMN products.stock IS 'Current stock quantity available';
COMMENT ON COLUMN vendors.status IS 'Whether the vendor is active or inactive';

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

SELECT 'Community Cart Supabase schema setup completed successfully!' as message;
