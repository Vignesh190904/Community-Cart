-- Community Cart Database Schema
-- Multi-community e-commerce platform for local communities

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CORE TABLES
-- ========================================

-- Communities table - the foundation for multi-community support
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Vendors table - shop owners within communities
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, shop_name)
);

-- Customers table - end users within communities
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    block VARCHAR(50),
    flat VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Admins table - platform administrators
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Categories table - product categories per community
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(community_id, name)
);

-- Products table - items sold by vendors
CREATE TABLE products (
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

-- Orders table - customer orders
CREATE TABLE orders (
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

-- Order items table - individual items in orders
CREATE TABLE order_items (
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
CREATE INDEX idx_communities_name ON communities(name);

-- Vendors indexes
CREATE INDEX idx_vendors_community_id ON vendors(community_id);
CREATE INDEX idx_vendors_shop_name ON vendors(shop_name);

-- Customers indexes
CREATE INDEX idx_customers_community_id ON customers(community_id);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Admins indexes
CREATE INDEX idx_admins_email ON admins(email);

-- Categories indexes
CREATE INDEX idx_categories_community_id ON categories(community_id);
CREATE INDEX idx_categories_name ON categories(name);

-- Products indexes
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

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
CREATE POLICY "Communities are viewable by everyone" ON communities
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage communities" ON communities
    FOR ALL USING (auth.role() = 'admin');

-- Vendors policies
CREATE POLICY "Vendors are viewable by community members" ON vendors
    FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their own data" ON vendors
    FOR ALL USING (auth.uid() = id);

-- Customers policies
CREATE POLICY "Customers can view their own data" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can manage their own data" ON customers
    FOR ALL USING (auth.uid() = id);

-- Admins policies
CREATE POLICY "Admins can manage all data" ON admins
    FOR ALL USING (auth.role() = 'admin');

-- Categories policies
CREATE POLICY "Categories are viewable by community members" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (auth.role() = 'admin');

-- Products policies
CREATE POLICY "Products are viewable by community members" ON products
    FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their own products" ON products
    FOR ALL USING (auth.uid() = vendor_id);

-- Orders policies
CREATE POLICY "Customers can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Vendors can view orders for their shop" ON orders
    FOR SELECT USING (auth.uid() = vendor_id);

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can update order status" ON orders
    FOR UPDATE USING (auth.uid() = vendor_id);

-- Order items policies
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
-- SAMPLE DATA (OPTIONAL)
-- ========================================

-- Insert sample community
INSERT INTO communities (name, address) VALUES 
('Sunset Gardens', '123 Sunset Boulevard, City Center');

-- Insert sample categories
INSERT INTO categories (community_id, name) VALUES 
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Groceries'),
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Electronics'),
((SELECT id FROM communities WHERE name = 'Sunset Gardens'), 'Clothing');

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update order total when order items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_items 
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    )
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update order totals
CREATE TRIGGER trigger_update_order_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

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

-- Trigger to automatically update product stock
CREATE TRIGGER trigger_update_product_stock
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View for vendor dashboard
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
    SUM(o.total_amount) as total_revenue
FROM vendors v
JOIN communities c ON v.community_id = c.id
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name, v.shop_name, c.name;

-- View for customer orders with details
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
COMMENT ON COLUMN orders.status IS 'Order status: pending, confirmed, preparing, ready, delivered, cancelled';
COMMENT ON COLUMN products.available IS 'Whether the product is currently available for purchase';
COMMENT ON COLUMN products.stock IS 'Current stock quantity available';
