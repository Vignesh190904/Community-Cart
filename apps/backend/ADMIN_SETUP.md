# Admin Account Setup Guide

This guide explains how to set up the default admin account for the Community Cart project.

## Default Admin Credentials

- **Email**: `vignesh190904@gmail.com`
- **Password**: `LordVikky@190904`

## Prerequisites

1. Ensure you have the following environment variables set in your `.env` file:
   ```
   SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Method 1: Using Node.js Script (Recommended)

1. Run the admin creation script:
   ```bash
   npm run create-admin
   ```

2. The script will:
   - Hash the password using bcrypt
   - Create a user in Supabase Auth
   - Insert admin details into the `admins` table
   - Display confirmation and credentials

## Method 2: Manual SQL Execution

If you prefer to run SQL manually in the Supabase SQL Editor:

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the following SQL (replace the password hash with a real bcrypt hash):

```sql
-- Insert the default admin account
INSERT INTO admins (id, name, email, phone, password_hash, created_at) 
VALUES (
    gen_random_uuid(),
    'Vignesh Admin',
    'vignesh190904@gmail.com',
    NULL,
    '$2b$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
    now()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    created_at = EXCLUDED.created_at;
```

## Verifying the Admin Account

After creation, you can verify the admin account exists by:

1. **Checking the database**:
   ```sql
   SELECT id, name, email, created_at FROM admins WHERE email = 'vignesh190904@gmail.com';
   ```

2. **Testing login** in the Admin Portal:
   - Navigate to `http://localhost:3000/login`
   - Use the credentials above
   - You should be redirected to the dashboard

## Security Notes

- The password is hashed using bcrypt with 10 salt rounds
- The admin account has full platform access
- Consider changing the default password after first login
- The service role key has elevated permissions - keep it secure

## Troubleshooting

### Common Issues

1. **"Service role key not found"**
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env` file
   - The service role key is different from the anon key

2. **"User already exists"**
   - The script handles this gracefully with upsert logic
   - Existing admin accounts will be updated

3. **"Table admins does not exist"**
   - Run the database schema first: `database_schema.sql`
   - Ensure the `admins` table is created

### Getting Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "service_role" key (not the "anon" key)

## Next Steps

After creating the admin account:

1. Test login in the Admin Portal
2. Create additional admin accounts if needed
3. Set up vendor accounts through the admin interface
4. Configure community settings

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify environment variables are correct
3. Ensure database schema is properly set up
4. Check Supabase project permissions
