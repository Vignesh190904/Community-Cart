# Port Configuration Summary

## Overview
All applications have been hardcoded to use specific ports as requested:

- **Admin Portal**: Port 3000 (hardcoded)
- **Vendor Portal**: Port 5000 (hardcoded)  
- **Backend API**: Port 8000 (hardcoded)

## Changes Made

### 1. Vite Configuration Files
- **`apps/admin-portal/vite.config.js`**: Set port to 3000 with `strictPort: true`
- **`apps/vendor-portal/vite.config.js`**: Set port to 5000 with `strictPort: true`

### 2. Backend Server Configuration
- **`apps/backend/src/server.js`**: Hardcoded PORT to 8000 (removed environment variable fallback)

### 3. API Service Files
- **`apps/admin-portal/src/services/api.js`**: Hardcoded API_BASE_URL to `http://localhost:8000`
- **`apps/vendor-portal/src/lib/api.jsx`**: Hardcoded API_BASE_URL to `http://localhost:8000`
- **`apps/vendor-portal/src/services/api.js`**: Hardcoded API_BASE_URL to `http://localhost:8000`

### 4. Customer App Configuration
- **`apps/customer-app/lib/utils/constants.dart`**: Hardcoded baseUrl to `http://localhost:8000`

### 5. CORS Configuration
- **`apps/backend/src/config/cors.js`**: Updated allowed origins to include hardcoded ports 3000 and 5000

### 6. Test Files
- **`apps/admin-portal/test-api.js`**: Hardcoded API_BASE_URL to `http://localhost:8000`
- **`apps/admin-portal/test-backend.js`**: Hardcoded API_BASE_URL to `http://localhost:8000`
- **`apps/admin-portal/test-login.js`**: Hardcoded API_BASE_URL to `http://localhost:8000` and updated success message

### 7. Documentation Files
- **`README.md`**: Updated to reflect hardcoded ports
- **`apps/admin-portal/README.md`**: Updated API endpoint documentation
- **`apps/admin-portal/SETUP.md`**: Updated setup instructions
- **`apps/vendor-portal/README.md`**: Updated access URL
- **`apps/backend/TROUBLESHOOTING.md`**: Updated troubleshooting instructions
- **`SUPABASE_REFACTOR_COMPLETE.md`**: Updated environment configuration section

### 8. Environment Configuration
- **`apps/admin-portal/env.example`**: Updated API configuration comment

## Verification Steps

### 1. Start All Applications
```bash
# From root directory
npm run dev
```

### 2. Verify Ports Are Correct
- **Backend API**: http://localhost:8000/health
- **Admin Portal**: http://localhost:3000
- **Vendor Portal**: http://localhost:5000

### 3. Test API Connectivity
```bash
# Test backend health
curl http://localhost:8000/health

# Test admin portal API
curl http://localhost:8000/admin/health

# Test vendor portal API
curl http://localhost:8000/vendor/health
```

## Benefits of Hardcoded Ports

1. **Consistency**: All team members will use the same ports
2. **Documentation**: Clear and unambiguous port references
3. **Deployment**: Easier deployment configuration
4. **Troubleshooting**: Simplified debugging and support

## Important Notes

- All applications now use `strictPort: true` in Vite configs to prevent fallback to other ports
- Backend no longer respects `PORT` environment variable
- All API services are hardcoded to connect to port 8000
- CORS is configured to allow requests from the hardcoded frontend ports

## Rollback Instructions

If you need to revert to environment-based port configuration:

1. Restore `process.env.PORT || 8000` in `apps/backend/src/server.js`
2. Restore environment variable fallbacks in API service files
3. Set `strictPort: false` in Vite configs
4. Update documentation to reflect dynamic port usage
