-- ========================================
-- DUMMY DATA FILLER FOR COMMUNITY CART
-- ========================================
-- This file inserts sample vendor data for testing
-- All inserts use ON CONFLICT DO NOTHING for safety

-- Insert sample vendors with realistic data
INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Rajesh Kumar', 'rajesh.kumar@example.com', 'Fresh Fruits Corner', '+91-9876543210', 'Rajesh Fresh Fruits Pvt Ltd', 'fruits', 'Block A, Flat 101, Green Valley Society, Mumbai', 'Premium quality fresh fruits and vegetables. Home delivery available.', 4.5, 156, 45250.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Priya Sharma', 'priya.sharma@example.com', 'Daily Grocery Store', '+91-8765432109', 'Priya Grocery Mart', 'grocery', 'Block B, Shop 15, Sunshine Plaza, Delhi', 'Complete grocery store with household essentials, dairy, and packaged foods.', 4.2, 89, 28750.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Amit Patel', 'amit.patel@example.com', 'Bakery Delights', '+91-7654321098', 'Amit Bakery & Confectionery', 'bakery', 'Block C, Ground Floor, Sweet Home Complex, Bangalore', 'Fresh bread, cakes, pastries, and custom birthday cakes. Made fresh daily.', 4.7, 234, 67890.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Sunita Verma', 'sunita.verma@example.com', 'Organic Vegetables', '+91-6543210987', 'Sunita Organic Farm', 'vegetables', 'Block D, Shop 8, Organic Market, Pune', '100% organic vegetables grown without pesticides. Farm to table delivery.', 4.8, 312, 89200.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Vikram Singh', 'vikram.singh@example.com', 'Spice World', '+91-5432109876', 'Vikram Spice Traders', 'general', 'Block E, Shop 22, Spice Bazaar, Chennai', 'Premium quality spices, herbs, and dry fruits. Bulk orders welcome.', 4.3, 67, 18900.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Meera Iyer', 'meera.iyer@example.com', 'Home Kitchen', '+91-4321098765', 'Meera Home Kitchen', 'food', 'Block F, Flat 205, Food Court, Hyderabad', 'Home-cooked meals, tiffin services, and party catering. Hygienic and delicious.', 4.6, 178, 45600.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Arun Reddy', 'arun.reddy@example.com', 'Tech Gadgets', '+91-3210987654', 'Arun Electronics', 'general', 'Block G, Shop 12, Tech Mall, Kolkata', 'Latest smartphones, accessories, and electronic gadgets. Authorized dealer.', 4.1, 45, 125000.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

INSERT INTO vendors (name, email, shop_name, phone, business_name, category, address, description, rating, total_orders, total_revenue, status) VALUES
('Kavita Joshi', 'kavita.joshi@example.com', 'Beauty Corner', '+91-2109876543', 'Kavita Beauty Products', 'general', 'Block H, Shop 5, Beauty Plaza, Ahmedabad', 'Cosmetics, skincare, and beauty products. Professional consultation available.', 4.4, 92, 23400.00, 'active')
ON CONFLICT (name, email) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, phone, address, block, flat) VALUES
('Rahul Gupta', '+91-9876543211', 'Block A, Flat 102, Green Valley Society, Mumbai', 'A', '102')
ON CONFLICT DO NOTHING;

INSERT INTO customers (name, phone, address, block, flat) VALUES
('Anjali Desai', '+91-8765432101', 'Block B, Flat 45, Sunshine Plaza, Delhi', 'B', '45')
ON CONFLICT DO NOTHING;

INSERT INTO customers (name, phone, address, block, flat) VALUES
('Suresh Kumar', '+91-7654321091', 'Block C, Flat 78, Sweet Home Complex, Bangalore', 'C', '78')
ON CONFLICT DO NOTHING;

-- Insert sample products for vendors
INSERT INTO products (vendor_id, name, description, price, stock, unit, available) 
SELECT v.id, 'Fresh Apples', 'Sweet and juicy red apples', 120.00, 50, 'kg', true
FROM vendors v WHERE v.email = 'rajesh.kumar@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (vendor_id, name, description, price, stock, unit, available) 
SELECT v.id, 'Organic Tomatoes', 'Fresh organic tomatoes', 80.00, 30, 'kg', true
FROM vendors v WHERE v.email = 'sunita.verma@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (vendor_id, name, description, price, stock, unit, available) 
SELECT v.id, 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 45.00, 20, 'piece', true
FROM vendors v WHERE v.email = 'amit.patel@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO products (vendor_id, name, description, price, stock, unit, available) 
SELECT v.id, 'Basmati Rice', 'Premium quality basmati rice', 85.00, 100, 'kg', true
FROM vendors v WHERE v.email = 'priya.sharma@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO orders (customer_id, vendor_id, total_amount, payment_method, status, delivery_address, notes)
SELECT 
    c.id as customer_id,
    v.id as vendor_id,
    250.00 as total_amount,
    'COD' as payment_method,
    'completed' as status,
    c.address as delivery_address,
    'Please deliver in the evening' as notes
FROM customers c, vendors v 
WHERE c.phone = '+91-9876543211' AND v.email = 'rajesh.kumar@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO orders (customer_id, vendor_id, total_amount, payment_method, status, delivery_address, notes)
SELECT 
    c.id as customer_id,
    v.id as vendor_id,
    180.00 as total_amount,
    'ONLINE' as payment_method,
    'pending' as status,
    c.address as delivery_address,
    'Contact before delivery' as notes
FROM customers c, vendors v 
WHERE c.phone = '+91-8765432101' AND v.email = 'amit.patel@example.com'
ON CONFLICT DO NOTHING;

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    o.id as order_id,
    p.id as product_id,
    p.name as product_name,
    2 as quantity,
    p.price as unit_price,
    p.price * 2 as total_price
FROM orders o
JOIN vendors v ON o.vendor_id = v.id
JOIN products p ON v.id = p.vendor_id
WHERE v.email = 'rajesh.kumar@example.com' AND p.name = 'Fresh Apples'
ON CONFLICT DO NOTHING;

-- Update vendor metrics
UPDATE vendors 
SET total_orders = (
    SELECT COUNT(*) FROM orders WHERE vendor_id = vendors.id
),
total_revenue = (
    SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE vendor_id = vendors.id AND status = 'completed'
);

-- Completion message
SELECT 'Dummy data inserted successfully!' as message;
