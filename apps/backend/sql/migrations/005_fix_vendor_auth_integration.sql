-- Migration: Fix vendor authentication integration with Supabase Auth
-- This migration ensures vendors table works properly with Supabase Auth

-- 1. Add email column to vendors table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vendors' AND column_name = 'email') THEN
        ALTER TABLE vendors ADD COLUMN email VARCHAR(255);
    END IF;
END $$;

-- 2. Add password_hash column to vendors table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vendors' AND column_name = 'password_hash') THEN
        ALTER TABLE vendors ADD COLUMN password_hash VARCHAR(255);
    END IF;
END $$;

-- 3. Make email column NOT NULL if it's not already
ALTER TABLE vendors ALTER COLUMN email SET NOT NULL;

-- 4. Make password_hash column nullable (since we use Supabase Auth)
ALTER TABLE vendors ALTER COLUMN password_hash DROP NOT NULL;

-- 5. Add unique constraint on name if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'vendors_name_unique') THEN
        ALTER TABLE vendors ADD CONSTRAINT vendors_name_unique UNIQUE (name);
    END IF;
END $$;

-- 6. Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint 
                   WHERE conname = 'vendors_email_unique') THEN
        ALTER TABLE vendors ADD CONSTRAINT vendors_email_unique UNIQUE (email);
    END IF;
END $$;

-- 7. Update existing vendors to have email if they don't have one
UPDATE vendors 
SET email = 'vendor_' || id || '@example.com' 
WHERE email IS NULL;

-- 8. Ensure all vendors have a name (safety check)
UPDATE vendors 
SET name = 'Vendor ' || id 
WHERE name IS NULL OR name = '';

-- 9. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_community_id ON vendors(community_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- 10. Add check constraints for data integrity
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vendors_name_length') THEN
        ALTER TABLE vendors ADD CONSTRAINT vendors_name_length CHECK (LENGTH(name) >= 2);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vendors_email_format') THEN
        ALTER TABLE vendors ADD CONSTRAINT vendors_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vendors_phone_format') THEN
        ALTER TABLE vendors ADD CONSTRAINT vendors_phone_format CHECK (phone ~* '^[0-9+\-\s()]{8,15}$');
    END IF;
END $$;

-- 11. Drop existing RLS policies to recreate them properly
DROP POLICY IF EXISTS "Vendors can view their own data" ON vendors;
DROP POLICY IF EXISTS "Admins can view all vendors" ON vendors;
DROP POLICY IF EXISTS "Admins can insert vendors" ON vendors;
DROP POLICY IF EXISTS "Admins can update vendors" ON vendors;
DROP POLICY IF EXISTS "Admins can delete vendors" ON vendors;

-- 12. Create comprehensive RLS policies for vendors table
-- Policy for vendors to view their own data (using Supabase Auth)
CREATE POLICY "Vendors can view their own data" ON vendors
    FOR SELECT USING (auth.uid() = id);

-- Policy for admins to view all vendors
CREATE POLICY "Admins can view all vendors" ON vendors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );

-- Policy for admins to insert vendors
CREATE POLICY "Admins can insert vendors" ON vendors
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );

-- Policy for admins to update vendors
CREATE POLICY "Admins can update vendors" ON vendors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );

-- Policy for admins to delete vendors
CREATE POLICY "Admins can delete vendors" ON vendors
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );

-- 13. Enable RLS if not already enabled
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- 14. Grant necessary permissions
GRANT ALL ON vendors TO authenticated;
GRANT ALL ON vendors TO service_role;

-- 15. Create a function to handle vendor creation with Supabase Auth integration
CREATE OR REPLACE FUNCTION create_vendor_with_auth(
    vendor_id UUID,
    vendor_name TEXT,
    vendor_email TEXT,
    vendor_phone TEXT,
    vendor_community_id UUID,
    vendor_shop_name TEXT DEFAULT NULL,
    vendor_business_name TEXT DEFAULT NULL,
    vendor_category TEXT DEFAULT 'general',
    vendor_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
    -- Insert vendor record (password_hash is nullable since we use Supabase Auth)
    INSERT INTO vendors (
        id,
        name,
        email,
        phone,
        community_id,
        shop_name,
        business_name,
        category,
        description,
        status,
        created_at,
        updated_at
    ) VALUES (
        vendor_id,
        vendor_name,
        vendor_email,
        vendor_phone,
        vendor_community_id,
        vendor_shop_name,
        vendor_business_name,
        vendor_category,
        vendor_description,
        true,
        NOW(),
        NOW()
    );
    
    RETURN vendor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_vendor_with_auth TO authenticated;
GRANT EXECUTE ON FUNCTION create_vendor_with_auth TO service_role;

-- 17. Verify the table structure
DO $$
BEGIN
    RAISE NOTICE 'Vendors table structure verification:';
    RAISE NOTICE 'Email column exists: %', EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'email'
    );
    RAISE NOTICE 'Password_hash column exists: %', EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'password_hash'
    );
    RAISE NOTICE 'Name unique constraint exists: %', EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'vendors_name_unique'
    );
    RAISE NOTICE 'Email unique constraint exists: %', EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'vendors_email_unique'
    );
    RAISE NOTICE 'RLS enabled: %', (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'vendors'
    );
END $$;
