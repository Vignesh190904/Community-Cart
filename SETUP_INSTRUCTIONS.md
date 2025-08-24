# 🚀 Community Cart - Backend & Admin Portal Setup Instructions

## 📋 Overview

This document provides step-by-step instructions to complete the implementation of the new vendor profile features in the Community Cart platform.

## ✅ What's Been Implemented

### Backend (Port 8000)
- ✅ New API endpoints added to `apps/backend/src/routes/adminVendorRoutes.js`:
  - `GET /admin/vendors/:id/performance` - Vendor performance with month/year filters
  - `GET /admin/vendors/:id/orders` - All orders for a vendor with pagination
  - `GET /admin/vendors/:id/metrics` - Comprehensive vendor metrics
  - `GET /admin/vendors/:id/revenue/monthly` - Monthly revenue trends

### Admin Portal Frontend (Port 3000)
- ✅ New API service: `apps/admin-portal/src/services/backendApi.js`
- ✅ Completely refactored VendorProfile component with:
  - Live data from backend APIs
  - Date range filters (last month, 3 months, 6 months, year)
  - Month/year specific filters
  - Indian Rupee (₹) currency formatting
  - Improved UI with vendor details sidebar
  - Revenue trend charts
  - Growth rate metrics
  - Removed "Top Product" section
  - Replaced "Revenue by Category" with better metrics

### CORS Configuration
- ✅ Updated CORS settings to allow communication between:
  - Admin Portal (port 3000)
  - Vendor Portal (port 5000) 
  - Backend (port 8000)

## 🔧 Required Setup Steps

### Step 1: Execute SQL Schema in Supabase

**IMPORTANT**: The `SQL Query.sql` file in the project root contains the complete database schema that needs to be executed in your Supabase dashboard.

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor**
3. Copy the entire content of `SQL Query.sql` from the project root
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create:
- Missing tables and columns
- `vendor_metrics` view
- `vendor_dashboard` view  
- `customer_orders` view
- RLS policies
- Triggers and functions

### Step 2: Create Sample Data (Optional)

After executing the SQL schema, you may want to create some sample vendors and orders to test the features:

1. Use the admin portal to create vendors
2. Or use the backend API to create sample data

### Step 3: Test the Implementation

1. **Start the Backend Server**:
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Start the Admin Portal**:
   ```bash
   cd apps/admin-portal
   npm run dev
   ```

3. **Test the Features**:
   - Login to admin portal with `admin@admin.com` / `12345678`
   - Navigate to Vendors page
   - Click on any vendor to view the new profile page
   - Test the filters and charts

## 🧪 Testing the New Endpoints

You can test the new API endpoints using the provided test scripts:

```bash
cd apps/backend
node test-with-auth.js
```

## 📊 New Features Summary

### Vendor Profile Page Features:
- **Live Data**: All metrics and charts fetch real data from Supabase
- **Date Filters**: Filter data by date ranges or specific months
- **Currency**: All amounts displayed in Indian Rupees (₹)
- **Charts**: Revenue trends and order status distribution
- **Metrics**: Growth rate, average monthly revenue, total profit
- **Vendor Details**: Sidebar with vendor information and member since date

### API Endpoints:
- **Performance**: Get vendor performance with optional month/year filters
- **Orders**: Get paginated vendor orders with status filtering
- **Metrics**: Get comprehensive vendor analytics
- **Revenue**: Get monthly revenue trends

## 🔐 Authentication

The admin user has been created with:
- **Email**: `admin@admin.com`
- **Password**: `12345678`

## 🚨 Troubleshooting

### If you encounter issues:

1. **Database Schema Errors**: Make sure `SQL Query.sql` has been executed in Supabase
2. **Authentication Issues**: The admin profile has been created, login should work
3. **CORS Issues**: CORS is configured to allow all three services to communicate
4. **Missing Data**: Create some vendors and orders to see the analytics in action

### Common Issues:
- **"vendor_metrics view not found"**: Execute the SQL schema
- **"No vendors found"**: Create some vendors through the admin portal
- **"Authentication failed"**: Admin credentials are `admin@admin.com` / `12345678`

## 📞 Support

If you encounter any issues during setup, please:
1. Check that the SQL schema has been executed
2. Verify the backend server is running on port 8000
3. Ensure the admin portal is running on port 3000
4. Check the browser console for any JavaScript errors

---

**🎉 Once completed, you'll have a fully functional vendor profile system with live data, filters, and comprehensive analytics!**
