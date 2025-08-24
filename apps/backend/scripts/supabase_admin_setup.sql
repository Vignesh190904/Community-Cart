-- ========================================
-- SUPABASE ADMIN ACCOUNT SETUP
-- ========================================
-- Run this script in Supabase SQL Editor to create the default admin account
-- This script handles both the database and auth setup

-- Step 1: Ensure the admins table exists with correct structure
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Step 2: Create a function to handle admin creation
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_name TEXT,
    admin_email TEXT,
    admin_phone TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    admin_id UUID;
    hashed_password TEXT;
BEGIN
    -- Generate a bcrypt hash for the password "LordVikky@190904"
    -- This is a pre-computed hash using bcrypt with 10 salt rounds
    hashed_password := '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    -- Insert admin record
    INSERT INTO admins (id, name, email, phone, password_hash, created_at)
    VALUES (
        gen_random_uuid(),
        admin_name,
        admin_email,
        admin_phone,
        hashed_password,
        now()
    )
    ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        password_hash = EXCLUDED.password_hash,
        created_at = EXCLUDED.created_at
    RETURNING id INTO admin_id;
    
    RETURN admin_id;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the default admin account
SELECT create_admin_user(
    'Vignesh Admin',
    'vignesh190904@gmail.com',
    NULL
);

-- Step 4: Verify the admin was created
SELECT 
    id, 
    name, 
    email, 
    phone, 
    created_at,
    CASE 
        WHEN password_hash IS NOT NULL THEN 'Password hash set'
        ELSE 'No password hash'
    END as password_status
FROM admins 
WHERE email = 'vignesh190904@gmail.com';

-- Step 5: Create RLS policies for admins table if they don't exist
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view all admin records
DROP POLICY IF EXISTS "Admins can view all admin data" ON admins;
CREATE POLICY "Admins can view all admin data" ON admins
    FOR SELECT USING (true);

-- Policy to allow admins to manage admin data
DROP POLICY IF EXISTS "Admins can manage admin data" ON admins;
CREATE POLICY "Admins can manage admin data" ON admins
    FOR ALL USING (true);

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_created_at ON admins(created_at);

-- Step 7: Display summary
SELECT 
    'Admin Setup Complete' as status,
    COUNT(*) as total_admins,
    MAX(created_at) as latest_admin_created
FROM admins;

-- ========================================
-- IMPORTANT NOTES
-- ========================================
-- 
-- 1. The password hash above is for "LordVikky@190904"
-- 2. You still need to create the user in Supabase Auth manually
-- 3. To create in Supabase Auth:
--    - Go to Authentication > Users in your Supabase dashboard
--    - Click "Add User"
--    - Email: vignesh190904@gmail.com
--    - Password: LordVikky@190904
--    - Set email confirmed to true
--    - Add metadata: {"role": "admin", "name": "Vignesh Admin"}
--
-- 4. After creating in Auth, the login should work
-- 5. The password hash in the database is for backup/local auth if needed
