# Fixing Supabase Auth 400 Error

## Problem
You're getting a 400 error when trying to log into the Admin Portal. This happens because the admin account doesn't exist in Supabase Auth yet.

## Solution Steps

### Step 1: Run the SQL Script in Supabase
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/gqbdhpcnrsbexrvkfkso
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the entire content of `supabase_admin_setup.sql`
4. Click **Run** to execute the script

This will:
- Create the `admins` table if it doesn't exist
- Insert the default admin record
- Set up proper RLS policies
- Create necessary indexes

### Step 2: Create User in Supabase Auth
1. In your Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** button
3. Fill in the form:
   - **Email**: `vignesh190904@gmail.com`
   - **Password**: `LordVikky@190904`
   - **Email Confirmed**: ✅ Check this box
   - **User Metadata**: Add this JSON:
     ```json
     {
       "role": "admin",
       "name": "Vignesh Admin"
     }
     ```
4. Click **Create User**

### Step 3: Test the Login
1. Go to your Admin Portal: `http://localhost:3000/login`
2. Use the credentials:
   - Email: `vignesh190904@gmail.com`
   - Password: `LordVikky@190904`
3. You should now be able to log in successfully

## Alternative: Use the Node.js Script

If you prefer to use the automated script:

1. **Set up environment variables** in `apps/backend/.env`:
   ```
   SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. **Get your Service Role Key**:
   - Go to Supabase Dashboard → Settings → API
   - Copy the "service_role" key (not the "anon" key)

3. **Run the script**:
   ```bash
   cd apps/backend
   npm run create-admin
   ```

## Why This Happens

The 400 error occurs because:
1. The Admin Portal tries to authenticate with Supabase Auth
2. Supabase Auth doesn't have a user with those credentials
3. The database table exists but Supabase Auth is separate
4. Both need to be set up for authentication to work

## Verification

After completing the steps, you can verify:

1. **Database**: Check the `admins` table has your record
2. **Auth**: Check Authentication → Users has your user
3. **Login**: Try logging into the Admin Portal

## Troubleshooting

### Still getting 400 error?
- Ensure the user was created in Supabase Auth (not just the database)
- Check that email confirmation is set to true
- Verify the password matches exactly: `LordVikky@190904`

### User exists but can't log in?
- Check if the user is confirmed in Supabase Auth
- Verify the password is correct
- Check browser console for additional error details

### Database errors?
- Ensure you have the correct permissions in Supabase
- Check that the SQL script ran successfully
- Verify the `admins` table structure matches the schema
