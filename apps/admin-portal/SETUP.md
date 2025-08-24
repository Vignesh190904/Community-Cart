# Admin Portal Setup Guide

## Prerequisites

1. **Backend Server**: Make sure the backend server is running on `http://localhost:8000` (hardcoded)
2. **Supabase Project**: You need a Supabase project with the correct database schema
3. **Node.js**: Version 16 or higher

## Quick Setup

### 1. Install Dependencies
```bash
cd apps/admin-portal
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `apps/admin-portal` directory:

```env
# Supabase Configuration (get these from your Supabase project settings)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration (hardcoded to port 8000)
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

The admin portal will be available at `http://localhost:3000` (hardcoded)

## Database Setup

Make sure your Supabase database has the following tables:

1. **admins** - Admin user profiles
2. **vendors** - Vendor profiles
3. **communities** - Community information
4. **orders** - Order data
5. **customers** - Customer profiles

## Creating an Admin User

1. **Via Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Users
   - Create a new user with admin email
   - Add the user to the `admins` table manually

2. **Via API** (if signup endpoint is enabled):
   ```bash
   curl -X POST http://localhost:8000/admin/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "your-password",
       "name": "Admin User"
     }'
   ```

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**:
   - Check if backend server is running on port 8000 (hardcoded)
   - Verify CORS configuration in backend
   - Check network connectivity

2. **Authentication errors**:
   - Verify Supabase credentials in `.env` file
   - Check if admin user exists in `admins` table
   - Ensure Supabase project is active

3. **Database errors**:
   - Verify database schema matches expected structure
   - Check Supabase RLS (Row Level Security) policies
   - Ensure proper table relationships

### Testing API Connectivity

Run the test script to verify API connectivity:
```bash
node test-api.js
```

### Development Tips

1. **Check Browser Console**: Look for any JavaScript errors or API call failures
2. **Network Tab**: Monitor API requests in browser developer tools
3. **Backend Logs**: Check backend server logs for any errors
4. **Supabase Logs**: Check Supabase dashboard for any database errors

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Update environment variables** for production:
   - Use production Supabase project
   - Update API base URL to production backend
   - Ensure proper CORS configuration

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive configuration
- Ensure proper authentication middleware is applied
- Regularly update dependencies for security patches
