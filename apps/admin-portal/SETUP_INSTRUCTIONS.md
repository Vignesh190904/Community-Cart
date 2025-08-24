# 🚀 Admin Portal Supabase Setup Instructions

## ✅ **Current Status**
The Admin Portal has been successfully refactored to use Supabase as the backend. The integration test shows that most features are working, but we need to run the SQL schema to create missing tables and columns.

## 🔧 **Required Action: Run SQL Schema**

### **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `gqbdhpcnrsbexrvkfkso`

### **Step 2: Run SQL Schema**
1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `SQL Query.sql` (located in the project root)
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

### **Step 3: Verify Setup**
After running the SQL, the following will be created:
- ✅ Enhanced `vendors` table with `address` column
- ✅ `vendor_metrics` view for analytics
- ✅ `monthly_revenue` view for revenue tracking
- ✅ `vendor_dashboard` view for vendor-specific data
- ✅ `customer_orders` view for order details
- ✅ Row Level Security (RLS) policies
- ✅ Database triggers for automatic updates

## 🧪 **Test the Integration**
After running the SQL schema, test the integration:

```bash
cd apps/admin-portal
node test-supabase-integration.js
```

Expected results:
- ✅ All tests should pass
- ✅ Vendor creation should work
- ✅ Analytics views should return data
- ✅ All CRUD operations should function

## 🎯 **Start the Admin Portal**
Once the SQL schema is executed:

```bash
cd apps/admin-portal
npm run dev
```

**Login Credentials:**
- **Email**: `admin@admin.com`
- **Password**: `12345678`
- **URL**: http://localhost:3001

## 📋 **What's Working Now**
- ✅ Authentication system
- ✅ Dashboard statistics (basic)
- ✅ Vendor listing
- ✅ Monthly order tracking
- ✅ Orders by status

## 🔄 **What Will Work After SQL Schema**
- ✅ Complete vendor CRUD operations
- ✅ Advanced analytics and metrics
- ✅ Real-time data updates
- ✅ Vendor performance tracking
- ✅ Revenue analytics
- ✅ All admin portal features

## 🚨 **Important Notes**
1. **Node.js Version**: Consider upgrading to Node.js 20+ for better Supabase support
2. **Environment Variables**: The Supabase credentials are hardcoded for testing but should be moved to `.env` for production
3. **RLS Policies**: The SQL schema includes comprehensive security policies
4. **Real-time Features**: All real-time subscriptions are configured and ready

## 🎉 **Next Steps**
1. Run the SQL schema in Supabase
2. Test the integration script
3. Start the admin portal
4. Verify all features work correctly
5. Consider upgrading Node.js version

---

**The Admin Portal is ready to be fully functional once the SQL schema is executed!**
