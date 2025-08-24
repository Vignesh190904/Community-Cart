# 🔧 Supabase Setup Guide for Vendor Management

This guide will help you set up your Supabase database to ensure vendor create and edit features work properly.

## 📋 Required Supabase Setup

### 1. **Run Database Migrations**

Execute these SQL scripts in your Supabase SQL Editor in the following order:

#### **Step 1: Complete Schema Migration**
```sql
-- Run this first in Supabase SQL Editor
-- File: apps/backend/sql/migrations/003_complete_schema.sql

-- This creates the complete database schema with all required tables and fields
```

#### **Step 2: Vendor Analytics Tables**
```sql
-- Run this second in Supabase SQL Editor
-- File: apps/backend/sql/migrations/002_vendor_analytics_tables.sql

-- This adds analytics and metrics tables for vendor performance tracking
```

#### **Step 3: Vendor Enhancements**
```sql
-- Run this third in Supabase SQL Editor
-- File: apps/backend/sql/migrations/001_vendor_enhancements.sql

-- This adds vendor settings and additional features
```

### 2. **Verify Vendors Table Structure**

After running the migrations, your `vendors` table should have these columns:

```sql
-- Check vendors table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'vendors' 
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (uuid, PRIMARY KEY)
- `community_id` (uuid, REFERENCES communities)
- `name` (text, NOT NULL)
- `shop_name` (text)
- `phone` (text)
- `business_name` (text)
- `category` (text, CHECK constraint)
- `address` (text)
- `rating` (numeric, DEFAULT 0)
- `status` (boolean, DEFAULT true)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

### 3. **Set Up Row Level Security (RLS)**

Enable RLS and create policies for the vendors table:

```sql
-- Enable RLS on vendors table
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Policy for admins to read all vendors
CREATE POLICY "Admins can read all vendors" ON vendors
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
);

-- Policy for admins to insert vendors
CREATE POLICY "Admins can insert vendors" ON vendors
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
);

-- Policy for admins to update vendors
CREATE POLICY "Admins can update vendors" ON vendors
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
);

-- Policy for admins to delete vendors
CREATE POLICY "Admins can delete vendors" ON vendors
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
);

-- Policy for vendors to read their own data
CREATE POLICY "Vendors can read own data" ON vendors
FOR SELECT USING (auth.uid() = id);

-- Policy for vendors to update their own data
CREATE POLICY "Vendors can update own data" ON vendors
FOR UPDATE USING (auth.uid() = id);
```

### 4. **Create Default Community**

Create a default community if it doesn't exist:

```sql
-- Insert default community if it doesn't exist
INSERT INTO communities (name, address, description)
VALUES (
  'Default Community',
  'Default Address',
  'Default community for new vendors'
) ON CONFLICT (name) DO NOTHING;
```

### 5. **Verify Admin Account**

Ensure your admin account exists in the `admins` table:

```sql
-- Check if admin exists
SELECT * FROM admins WHERE email = 'vignesh190904@gmail.com';

-- If not exists, create admin (run this in backend with proper password hashing)
-- Or use the create-admin script: npm run create-admin
```

## 🔍 Troubleshooting

### **Issue: "Vendor not found" error**
**Solution:** Check if the vendor ID exists in the database:
```sql
SELECT * FROM vendors WHERE id = 'vendor-id-here';
```

### **Issue: "Email already exists" error**
**Solution:** Check Supabase Auth users:
```sql
-- In Supabase Dashboard > Authentication > Users
-- Look for the email that's causing the conflict
```

### **Issue: "Validation failed" error**
**Solution:** Check the required fields in the form:
- Name (required, min 2 characters)
- Email (required, valid format)
- Password (required for create, min 6 characters)
- Phone (required, min 8 characters)
- Shop Name (required)

### **Issue: "Permission denied" error**
**Solution:** Check RLS policies and admin authentication:
```sql
-- Verify admin exists
SELECT * FROM admins WHERE id = auth.uid();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'vendors';
```

## 🧪 Testing the Setup

### **Test Vendor Creation**
1. Go to Admin Portal: `http://localhost:3000`
2. Login with admin credentials
3. Navigate to Vendors page
4. Click "Add Vendor"
5. Fill in all required fields:
   - Name: "Test Vendor"
   - Email: "test@example.com"
   - Password: "password123"
   - Shop Name: "Test Shop"
   - Phone: "1234567890"
6. Click "Create Vendor"

### **Test Vendor Editing**
1. Click the edit button on any vendor
2. Update fields like name, phone, category
3. Click "Update Vendor"

### **Expected Behavior**
- ✅ Vendor creation should work without errors
- ✅ Vendor should appear in the list immediately
- ✅ Vendor should be able to login to vendor portal
- ✅ Vendor editing should work without errors
- ✅ Changes should persist in database

## 📊 Database Verification Queries

### **Check All Vendors**
```sql
SELECT 
  v.id,
  v.name,
  v.shop_name,
  v.email,
  v.phone,
  v.category,
  v.status,
  c.name as community_name,
  v.created_at
FROM vendors v
LEFT JOIN communities c ON v.community_id = c.id
ORDER BY v.created_at DESC;
```

### **Check Vendor Auth Users**
```sql
-- In Supabase Dashboard > Authentication > Users
-- Look for users with role = 'vendor'
```

### **Check Communities**
```sql
SELECT * FROM communities ORDER BY created_at DESC;
```

## 🚨 Common Issues & Solutions

### **Issue: Missing email field in vendors table**
**Solution:** The email is stored in Supabase Auth, not in the vendors table. The backend handles this automatically.

### **Issue: Category validation fails**
**Solution:** Ensure category is one of: 'vegetables', 'grocery', 'bakery', 'food', 'general'

### **Issue: Phone number validation fails**
**Solution:** Phone must be at least 8 characters long

### **Issue: Password validation fails**
**Solution:** Password must be at least 6 characters long

## 📞 Support

If you encounter any issues:

1. **Check browser console** for JavaScript errors
2. **Check backend logs** for API errors
3. **Check Supabase logs** for database errors
4. **Verify all migrations** have been run
5. **Test with the provided queries** above

## ✅ Success Checklist

- [ ] All migrations run successfully
- [ ] Vendors table has all required columns
- [ ] RLS policies are in place
- [ ] Default community exists
- [ ] Admin account exists
- [ ] Can create new vendors
- [ ] Can edit existing vendors
- [ ] Can delete vendors
- [ ] Vendors can login to vendor portal
- [ ] All validation works properly
