-- Script to create default admin account for Community Cart
-- Run this in Supabase SQL Editor or your database

-- First, let's ensure the admins table exists with the correct structure
-- (This should already exist based on the database_schema.sql)

-- Insert the default admin account
-- Note: The password will be hashed using bcrypt with salt rounds 10
-- Password: "LordVikky@190904" -> Hashed version below

INSERT INTO admins (id, name, email, phone, password_hash, created_at) 
VALUES (
    gen_random_uuid(),
    'Vignesh Admin',
    'vignesh190904@gmail.com',
    NULL,
    '$2b$10$YourHashedPasswordHere', -- This will be replaced with actual hash
    now()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    created_at = EXCLUDED.created_at;

-- Verify the admin was created
SELECT id, name, email, created_at FROM admins WHERE email = 'vignesh190904@gmail.com';

-- Note: The password_hash above is a placeholder. 
-- In a real implementation, you would hash the password using bcrypt
-- with something like: bcrypt.hashSync('LordVikky@190904', 10)
