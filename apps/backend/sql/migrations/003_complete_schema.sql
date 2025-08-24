-- Complete Community Cart Database Schema Migration
-- Run this in Supabase SQL Editor

-- ========================================
-- COMMUNITIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  address text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- VENDORS TABLE  
-- ========================================
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  name text NOT NULL,
  shop_name text,
  phone text,
  business_name text,
  category text CHECK (category IN ('vegetables', 'grocery', 'bakery', 'food', 'general')) DEFAULT 'general',
  address text,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- CUSTOMERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- CATEGORIES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(community_id, name)
);

-- ========================================
-- PRODUCTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'INR',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  unit text DEFAULT 'piece',
  available boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- ORDERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')) DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  currency text DEFAULT 'INR',
  delivery_address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- ORDER ITEMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL, -- Store name in case product is deleted
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  total_price numeric NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at timestamptz DEFAULT now()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_vendors_community ON vendors(community_id);
CREATE INDEX IF NOT EXISTS idx_vendors_created ON vendors(created_at);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_created ON orders(vendor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- Vendor metrics view
CREATE OR REPLACE VIEW vendor_metrics AS
SELECT 
  v.id as vendor_id,
  v.name as vendor_name,
  v.shop_name,
  v.rating,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT CASE WHEN p.available = true THEN p.id END) as active_products,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as total_revenue,
  COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount END) * 0.1, 0) as total_profit, -- Assume 10% profit margin
  COALESCE(AVG(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as avg_order_value
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name, v.shop_name, v.rating;

-- Monthly revenue view
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
  o.vendor_id,
  DATE_TRUNC('month', o.created_at) as month,
  COUNT(*) as orders_count,
  SUM(o.total_amount) as revenue
FROM orders o
WHERE o.status = 'completed'
GROUP BY o.vendor_id, DATE_TRUNC('month', o.created_at)
ORDER BY month DESC;

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (OPTIONAL)
-- ========================================

-- Insert default community
INSERT INTO communities (name, address, description) 
VALUES ('Default Community', 'Sample Address', 'Default community for new vendors')
ON CONFLICT (name) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (community_id, name, description)
SELECT c.id, category_name, category_desc
FROM communities c, (VALUES 
  ('Vegetables', 'Fresh vegetables and greens'),
  ('Fruits', 'Fresh seasonal fruits'),
  ('Grocery', 'Daily grocery items'),
  ('Bakery', 'Bread, cakes and baked goods'),
  ('Dairy', 'Milk, cheese and dairy products'),
  ('Meat', 'Fresh meat and poultry'),
  ('Spices', 'Herbs and spices'),
  ('Beverages', 'Drinks and beverages')
) AS categories(category_name, category_desc)
WHERE c.name = 'Default Community'
ON CONFLICT (community_id, name) DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Basic policies (can be customized based on auth requirements)
-- Allow service role to access everything
CREATE POLICY "Service role can access all" ON communities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON vendors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all" ON order_items FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read public data
CREATE POLICY "Authenticated users can read communities" ON communities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read categories" ON categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read products" ON products FOR SELECT USING (auth.role() = 'authenticated');

-- Vendors can manage their own data
CREATE POLICY "Vendors can manage own profile" ON vendors FOR ALL USING (auth.uid() = id);
CREATE POLICY "Vendors can manage own products" ON products FOR ALL USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors can manage own orders" ON orders FOR ALL USING (auth.uid() = vendor_id);

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
SELECT 'Community Cart database schema migration completed successfully!' as message;
