-- Migration: Vendor Portal Enhancements
-- Description: Add tables and columns required for production-ready vendor portal
-- Date: 2024-12-16

-- ========================================
-- CREATE VENDOR SETTINGS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS vendor_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    accept_orders BOOLEAN DEFAULT true NOT NULL,
    store_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "18:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
        "thursday": {"open": "09:00", "close": "18:00", "closed": false},
        "friday": {"open": "09:00", "close": "18:00", "closed": false},
        "saturday": {"open": "09:00", "close": "18:00", "closed": false},
        "sunday": {"open": "09:00", "close": "18:00", "closed": true}
    }'::jsonb,
    holidays DATE[] DEFAULT '{}',
    min_order_amount NUMERIC(10,2) DEFAULT 0 CHECK (min_order_amount >= 0),
    delivery_radius_km INTEGER DEFAULT 5 CHECK (delivery_radius_km >= 0),
    auto_accept_after_minutes INTEGER DEFAULT 0 CHECK (auto_accept_after_minutes >= 0),
    notification_preferences JSONB DEFAULT '{
        "email_orders": true,
        "sms_orders": false,
        "push_orders": true,
        "email_reviews": true,
        "email_promotions": false
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(vendor_id)
);

-- ========================================
-- CREATE ORDER STATUS HISTORY TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
    notes TEXT,
    changed_by_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ========================================
-- ADD COLUMNS TO EXISTING TABLES
-- ========================================

-- Add columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS unit VARCHAR(50),
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add columns to vendors table for enhanced profile
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at);

-- Order items table indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Order status history indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Vendor settings indexes
CREATE INDEX IF NOT EXISTS idx_vendor_settings_vendor_id ON vendor_settings(vendor_id);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_community_id ON categories(community_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- ========================================
-- UPDATE TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to vendor_settings table
DROP TRIGGER IF EXISTS update_vendor_settings_updated_at ON vendor_settings;
CREATE TRIGGER update_vendor_settings_updated_at
    BEFORE UPDATE ON vendor_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to vendors table if not exists
DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendors;
CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to products table if not exists
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Enable RLS on new tables
ALTER TABLE vendor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Vendor settings policies
DROP POLICY IF EXISTS "Vendors can manage their own settings" ON vendor_settings;
CREATE POLICY "Vendors can manage their own settings" ON vendor_settings
    FOR ALL USING (true); -- Service role will handle access control

-- Order status history policies
DROP POLICY IF EXISTS "Vendors can view order history for their orders" ON order_status_history;
CREATE POLICY "Vendors can view order history for their orders" ON order_status_history
    FOR SELECT USING (true); -- Service role will handle access control

DROP POLICY IF EXISTS "Vendors can create order history entries" ON order_status_history;
CREATE POLICY "Vendors can create order history entries" ON order_status_history
    FOR INSERT WITH CHECK (true); -- Service role will handle access control

-- ========================================
-- SEED DEFAULT DATA
-- ========================================

-- Insert default categories if they don't exist
INSERT INTO categories (community_id, name) 
SELECT c.id, category_name
FROM communities c
CROSS JOIN (
    VALUES 
    ('Groceries'),
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Home & Garden'),
    ('Health & Beauty'),
    ('Sports & Outdoors'),
    ('Toys & Games'),
    ('General')
) AS cat(category_name)
ON CONFLICT (community_id, name) DO NOTHING;

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- View for vendor dashboard summary
CREATE OR REPLACE VIEW vendor_dashboard_summary AS
SELECT 
    v.id as vendor_id,
    v.shop_name,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT CASE WHEN p.stock <= 10 THEN p.id END) as low_stock_products,
    COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'completed' AND o.created_at >= CURRENT_DATE THEN o.id END) as orders_today,
    COALESCE(SUM(CASE WHEN o.status = 'completed' AND o.created_at >= CURRENT_DATE THEN o.total_amount END), 0) as revenue_today,
    COALESCE(SUM(CASE WHEN o.status = 'completed' AND o.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN o.total_amount END), 0) as revenue_7d
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.shop_name;

-- View for product analytics
CREATE OR REPLACE VIEW product_analytics AS
SELECT 
    p.id as product_id,
    p.name,
    p.vendor_id,
    p.category_id,
    p.price,
    p.stock,
    p.available,
    COUNT(oi.id) as total_orders,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
    AVG(oi.price) as avg_selling_price,
    MAX(o.created_at) as last_ordered_at
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
GROUP BY p.id, p.name, p.vendor_id, p.category_id, p.price, p.stock, p.available;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE vendor_settings IS 'Stores vendor-specific settings and preferences';
COMMENT ON TABLE order_status_history IS 'Tracks all status changes for orders with timestamps';
COMMENT ON VIEW vendor_dashboard_summary IS 'Provides summary statistics for vendor dashboard';
COMMENT ON VIEW product_analytics IS 'Provides analytics data for products including sales metrics';

-- Migration completed successfully
