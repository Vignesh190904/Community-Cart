# 🔧 Environment Setup Guide

## 🚨 **CRITICAL: Missing Environment Variables**

The backend is failing because the `.env` file is missing. This is why vendor creation and updates are failing with 400 errors.

## 📋 **Required Setup**

### **1. Create `.env` file in `apps/backend/`**

Create a file named `.env` in the `apps/backend/` directory with the following content:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server Configuration
PORT=8000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### **2. Get Your Supabase Credentials**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### **3. Example `.env` file**

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NjQwMCwiZXhwIjoxOTUyMTIyNDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NTQ2NDAwLCJleHAiOjE5NTIxMjI0MDB9.example
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 🔍 **How to Verify Setup**

### **1. Test Environment Variables**

After creating the `.env` file, run this command to test:

```bash
cd apps/backend
node test-vendor-schema.js
```

You should see:
```
✅ Vendors table columns:
✅ Communities table exists
✅ RLS policies found: X
✅ Test vendor created successfully: [uuid]
🎉 All tests passed! Database schema is correct.
```

### **2. Test Backend API**

Start the backend and test the health endpoint:

```bash
npm run dev
```

Then visit: `http://localhost:8000/health`

You should see:
```json
{
  "success": true,
  "message": "Admin routes are working",
  "timestamp": "2024-12-16T..."
}
```

## 🚨 **Common Issues**

### **Issue: "Missing Supabase environment variables"**
**Solution:** Create the `.env` file with your Supabase credentials

### **Issue: "Invalid API key"**
**Solution:** Check that your Supabase keys are correct and copied properly

### **Issue: "Connection failed"**
**Solution:** Verify your Supabase URL is correct and the project is active

### **Issue: "Permission denied"**
**Solution:** Make sure you're using the `service_role` key, not the `anon` key

## 📞 **Support**

If you need help finding your Supabase credentials:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the values as shown above

## ✅ **Success Checklist**

- [ ] Created `.env` file in `apps/backend/`
- [ ] Added correct Supabase URL
- [ ] Added correct Supabase anon key
- [ ] Added correct Supabase service role key
- [ ] Tested with `node test-vendor-schema.js`
- [ ] Backend starts without errors
- [ ] Health endpoint responds correctly
- [ ] Vendor creation works
- [ ] Vendor updates work

## 🎯 **Next Steps**

After setting up the environment variables:

1. **Run the database migrations** (see `SUPABASE_SETUP_GUIDE.md`)
2. **Test vendor creation** in the admin portal
3. **Test vendor editing** in the admin portal
4. **Verify everything works** as expected
