# Troubleshooting Guide - Community Cart Backend

## Common Issues & Solutions

### 1. 404 Errors on Admin Portal API Calls

**Problem**: Getting 404 errors when Admin Portal tries to call backend APIs.

**Root Cause**: Path mismatch between frontend and backend.

**Solution**: 
- ✅ **Fixed**: Updated Admin Portal API service to use correct base URL
- ✅ **Fixed**: Backend routes are mounted at `/admin` (not `/api/admin`)

**Current API Endpoints** (hardcoded to port 8000):
- Dashboard Stats: `http://localhost:8000/admin/dashboard/stats`
- Get Vendors: `http://localhost:8000/admin/vendors`
- Create Vendor: `http://localhost:8000/admin/vendors/create`
- Update Vendor: `http://localhost:8000/admin/vendors/:id`
- Delete Vendor: `http://localhost:8000/admin/vendors/:id`

### 2. Backend Routes Not Working

**Problem**: Backend server running but routes returning 404.

**Solution**: Ensure backend is properly restarted after adding new routes.

```bash
# Stop backend (Ctrl+C)
# Restart backend
cd apps/backend
npm start
```

**Verify Routes Are Working** (hardcoded to port 8000):
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test admin routes
curl http://localhost:8000/admin/health
curl http://localhost:8000/admin/vendors
```

### 3. Database Tables Missing

**Problem**: Backend routes work but database queries fail.

**Solution**: Run the complete database setup script.

**Steps**:
1. Go to Supabase SQL Editor
2. Copy and paste `scripts/setup_database.sql`
3. Click Run
4. Verify tables were created

**Verify Database Setup**:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('communities', 'vendors', 'customers', 'admins');

-- Check sample data
SELECT COUNT(*) as vendors_count FROM vendors;
SELECT COUNT(*) as communities_count FROM communities;
```

### 4. Supabase Auth Issues

**Problem**: Admin login works but vendor creation fails.

**Solution**: Ensure Supabase client has proper permissions.

**Check Supabase Client Config**:
```javascript
// apps/backend/src/config/supabaseClient.js
const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Must use SERVICE_ROLE_KEY for admin operations
```

**Environment Variables**:
```bash
# apps/backend/.env
SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. CORS Issues

**Problem**: Frontend can't connect to backend due to CORS.

**Solution**: CORS is already configured in backend.

**Verify CORS Setup**:
```javascript
// apps/backend/src/server.js
app.use(cors());
app.use(express.json());
```

### 6. Port Conflicts

**Problem**: Backend won't start or shows "port already in use".

**Solution**: Check for conflicting processes.

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Restart backend
cd apps/backend
npm start
```

## Complete Setup Checklist

### ✅ Backend Setup
- [ ] Backend server running on port 8000 (hardcoded)
- [ ] All route files imported in server.js
- [ ] Routes mounted correctly
- [ ] Supabase client configured with service role key
- [ ] Environment variables set

### ✅ Database Setup
- [ ] Run `scripts/setup_database.sql` in Supabase
- [ ] All tables created successfully
- [ ] Sample data inserted
- [ ] RLS policies configured
- [ ] Indexes created

### ✅ Admin Portal Setup
- [ ] Admin user created in Supabase Auth
- [ ] API service using correct base URL
- [ ] All API endpoints accessible
- [ ] Dashboard stats loading
- [ ] Vendor management working

### ✅ Vendor Portal Setup
- [ ] API service using correct base URL
- [ ] Product management working
- [ ] Order management working

## Testing Endpoints

### Health Checks
```bash
# General health
curl http://localhost:8000/health

# Admin routes health
curl http://localhost:8000/admin/health

# Backend root
curl http://localhost:8000/
```

### Admin Endpoints
```bash
# Dashboard stats
curl http://localhost:8000/admin/dashboard/stats

# Get vendors
curl http://localhost:8000/admin/vendors

# Create vendor (POST)
curl -X POST http://localhost:8000/admin/vendors/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Vendor","email":"test@example.com","password":"password123","shop_name":"Test Shop","community_name":"Test Community"}'
```

### Vendor Endpoints
```bash
# Get products
curl http://localhost:8000/products?vendorId=test-id

# Get orders
curl http://localhost:8000/orders?vendorId=test-id
```

## Debug Mode

### Enable Backend Logging
```javascript
// Add to server.js for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Network Tab
1. Open Admin Portal in browser
2. Open Developer Tools → Network tab
3. Try to load dashboard or vendors page
4. Check which requests are failing and why

### Common Error Codes
- **404**: Route not found - check server.js and route mounting
- **500**: Server error - check backend console logs
- **400**: Bad request - check request body and validation
- **401**: Unauthorized - check authentication
- **403**: Forbidden - check permissions and RLS policies

## Quick Fix Commands

```bash
# Restart backend
cd apps/backend && npm start

# Check backend logs
# Look for any error messages in the console

# Test specific endpoint
curl http://localhost:8000/admin/health

# Verify database connection
# Check Supabase dashboard for any connection issues
```

## Still Having Issues?

1. **Check backend console** for error messages
2. **Verify all files** are saved and backend restarted
3. **Test endpoints** individually with curl
4. **Check Supabase** dashboard for any issues
5. **Verify environment variables** are set correctly

## Support

If issues persist:
1. Check backend console output
2. Verify database setup in Supabase
3. Test individual API endpoints
4. Check network requests in browser dev tools
