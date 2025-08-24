# 🚀 Community Cart Development Setup

This document describes the new development environment setup with automatic port management and process handling.

## 📋 Available Scripts

### Main Development Commands

```bash
# Start both admin portal and backend (recommended)
npm run dev

# Start all services (admin, backend, vendor)
npm run dev:all

# Start individual services
npm run dev:admin      # Admin portal on port 3000
npm run dev:backend    # Backend API on port 8000
npm run dev:vendor     # Vendor portal on port 5000
```

### Port Management Commands

```bash
# Check if ports are available
npm run check:ports

# Kill processes using development ports
npm run kill:ports

# Clean up and exit
npm run clean
```

### Utility Commands

```bash
# Install dependencies for all apps
npm run install:all

# Build all frontend applications
npm run build:all
```

## 🔧 How It Works

### Port Management
- **Admin Portal**: Always runs on port 3000
- **Backend API**: Always runs on port 8000
- **Vendor Portal**: Always runs on port 5000 (when included)

### Automatic Process Handling
1. **Port Checking**: Before starting, the script checks if ports are in use
2. **Process Killing**: If ports are busy, it automatically kills the processes
3. **Graceful Shutdown**: When you stop the dev server (Ctrl+C), all processes are terminated
4. **Cross-Platform**: Works on Windows, macOS, and Linux

### Concurrent Execution
- Uses `concurrently` to run multiple services simultaneously
- Color-coded output with prefixes: `[BACKEND]` and `[ADMIN]`
- All processes are killed together when one fails

## 🎯 Recommended Workflow

### For Daily Development
```bash
# 1. Start the development environment
npm run dev

# 2. Access your applications:
#    - Admin Portal: http://localhost:3000
#    - Backend API: http://localhost:8000/health
#    - Vendor Portal: http://localhost:5000 (if needed)

# 3. Stop with Ctrl+C when done
```

### If Ports Are Busy
```bash
# Check what's using the ports
npm run check:ports

# Kill processes using the ports
npm run kill:ports

# Then start development
npm run dev
```

### For Troubleshooting
```bash
# Clean everything and start fresh
npm run clean
npm run dev
```

## 🔍 Troubleshooting

### Port Already in Use
If you see an error like "Port 3000 is already in use":

1. **Automatic Fix**: The script will try to kill the process automatically
2. **Manual Fix**: Run `npm run kill:ports`
3. **Check**: Run `npm run check:ports` to see what's using the ports

### Process Not Starting
If a service fails to start:

1. Check the console output for error messages
2. Ensure all dependencies are installed: `npm run install:all`
3. Try cleaning and restarting: `npm run clean && npm run dev`

### Cross-Platform Compatibility
The script automatically detects your operating system and uses appropriate commands:
- **Windows**: Uses `netstat` and `taskkill`
- **macOS/Linux**: Uses `lsof` and `kill`

## 📁 File Structure

```
Community-Cart/
├── scripts/
│   └── dev-setup.js          # Main development script
├── apps/
│   ├── admin-portal/         # Admin portal (port 3000)
│   ├── backend/              # Backend API (port 8000)
│   └── vendor-portal/        # Vendor portal (port 5000)
├── package.json              # Root package.json with scripts
└── DEV_SETUP.md             # This file
```

## 🔄 Adding Vendor Portal

To include the vendor portal in the development setup:

1. **Edit the script**: Modify `scripts/dev-setup.js` to include vendor portal
2. **Update package.json**: Add vendor portal to the concurrently command
3. **Update CORS**: Ensure backend allows requests from port 5000

Example modification in `dev-setup.js`:
```javascript
// Add vendor portal to the concurrently command
const concurrently = spawn('npx', ['concurrently', 
  '--kill-others',
  '--prefix', 'name',
  '--names', 'BACKEND,ADMIN,VENDOR',
  '--prefix-colors', 'bgBlue.bold,bgGreen.bold,bgYellow.bold',
  'npm run dev:backend',
  'npm run dev:admin',
  'npm run dev:vendor'
], {
  stdio: 'inherit',
  shell: true
});
```

## 🎨 Customization

### Changing Ports
To change the default ports, edit `scripts/dev-setup.js`:

```javascript
const PORTS = {
  ADMIN: 3001,    // Change admin portal port
  BACKEND: 8001,  // Change backend port
  VENDOR: 5001    // Change vendor portal port
};
```

### Adding New Services
To add a new service:

1. Add the port to the `PORTS` object
2. Add the service to the concurrently command
3. Update the port checking logic
4. Add a new script in `package.json`

## 📝 Notes

- The script uses `--kill-others` flag, so if one process fails, all others are terminated
- All processes share the same terminal output with color-coded prefixes
- The script is designed to be idempotent - you can run it multiple times safely
- Environment variables are automatically loaded from `.env` files in each app directory
