# Community Cart Monorepo

This repository contains all applications for the Community Cart project, managed as a monorepo.

## Available Applications

- **Backend**: Node.js API server
- **Vendor Portal**: React application for vendors (Vite + React)
- **Admin Portal**: React application for administrators (Vite + React)
- **Customer App**: Flutter application for customers

## Default Admin Account

**Default Admin Credentials:**
- **Email**: `vignesh190904@gmail.com`
- **Password**: `LordVikky@190904`

> **Note**: These credentials are for initial setup. Consider changing the password after first login for security.

## 🚀 Quick Start

### Option 1: One-Command Setup (Recommended)

```bash
# Start both admin portal and backend with automatic port management
npm run dev
```

### Option 2: Platform-Specific Scripts

**Windows:**
```bash
dev.bat
```

**macOS/Linux:**
```bash
./dev.sh
```

### Option 3: Manual Setup

Follow the detailed setup instructions below.

## 📋 Development Scripts

### Main Commands
```bash
npm run dev          # Start admin portal + backend (recommended)
npm run dev:all      # Start all services (admin + backend + vendor)
npm run dev:admin    # Admin portal only (port 3000)
npm run dev:backend  # Backend API only (port 8000)
npm run dev:vendor   # Vendor portal only (port 5000)
```

### Port Management
```bash
npm run check:ports  # Check if ports are available
npm run kill:ports   # Kill processes using dev ports
npm run clean        # Clean up and exit
```

### Utilities
```bash
npm run install:all  # Install dependencies for all apps
npm run build:all    # Build all frontend applications
```

## 🔧 Getting Started (Detailed)

### 1. Install Dependencies

Run `npm install` in the root of the monorepo to install dependencies for all projects:

```bash
npm install
```

### 2. Environment Setup

Create `.env` files in the following locations:

**Backend** (`apps/backend/.env`):
```
SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Vendor Portal** (`apps/vendor-portal/.env`):
```
VITE_SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTUxOTMsImV4cCI6MjA3MDMzMTE5M30.s6oQMIxDXTirHrEcZO8WdBJvd2-SAnetFmNYVjr0yuI
```

**Admin Portal** (`apps/admin-portal/.env`):
```
VITE_SUPABASE_URL=https://gqbdhpcnrsbexrvkfkso.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRocGNucnNiZXhydmtma3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTUxOTMsImV4cCI6MjA3MDMzMTE5M30.s6oQMIxDXTirHrEcZO8WdBJvd2-SAnetFmNYVjr0yuI
```

### 3. Setup Default Admin Account

Before running the applications, you need to create the default admin account:

```bash
cd apps/backend
npm install
npm run create-admin
```

This will create the admin account with the credentials listed above.

### 4. Run Applications

#### Quick Start (Recommended)
```bash
npm run dev
```

This will:
- ✅ Check and free ports 3000 and 8000 if needed
- ✅ Start Admin Portal on `http://localhost:3000`
- ✅ Start Backend API on `http://localhost:8000`
- ✅ Provide color-coded output with `[ADMIN]` and `[BACKEND]` prefixes
- ✅ Gracefully stop all processes with Ctrl+C

#### Alternative: All Services
```bash
npm run dev:all
```

This starts all services including the vendor portal.

### 5. Preview URLs

- **Admin Portal**: [http://localhost:3000](http://localhost:3000)
- **Backend API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Vendor Portal**: [http://localhost:5000](http://localhost:5000) (when using `npm run dev:all`)

## 🔍 Troubleshooting

### Port Already in Use
If you see "Port 3000/8000 is already in use":

```bash
# Check what's using the ports
npm run check:ports

# Kill processes using the ports
npm run kill:ports

# Then start development
npm run dev
```

### Process Not Starting
```bash
# Clean everything and start fresh
npm run clean
npm run dev
```

### Cross-Platform Support
The development script automatically detects your OS and uses appropriate commands:
- **Windows**: Uses `netstat` and `taskkill`
- **macOS/Linux**: Uses `lsof` and `kill`

## 📚 Documentation

- **[Development Setup Guide](DEV_SETUP.md)** - Detailed information about the new development environment
- **[Backend Admin Setup Guide](apps/backend/ADMIN_SETUP.md)**
- **[Supabase Auth Fix Guide](apps/backend/SUPABASE_AUTH_FIX.md)** - Important: Fix for 400 errors

## Admin Portal Setup

For detailed instructions on setting up the admin account and troubleshooting, see:
- [Backend Admin Setup Guide](apps/backend/ADMIN_SETUP.md)
- [Supabase Auth Fix Guide](apps/backend/SUPABASE_AUTH_FIX.md) - **Important: Fix for 400 errors**

### Common Issues & Quick Fixes

**React Router Warnings**: These are resolved with future flags in the latest code.

**Supabase Auth 400 Error**: If you get a 400 error when trying to log into the Admin Portal:
1. **Quick Fix**: Run the SQL script in Supabase SQL Editor (see [SUPABASE_AUTH_FIX.md](apps/backend/SUPABASE_AUTH_FIX.md))
2. **Manual Fix**: Create the user manually in Supabase Auth dashboard
3. **Automated Fix**: Use `npm run create-admin` with proper environment variables

## Security Notes

- The default admin password should be changed after first login
- Keep your Supabase service role key secure
- Never commit `.env` files to version control
