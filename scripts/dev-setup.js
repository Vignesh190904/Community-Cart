#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { platform } = require('os');
const path = require('path');

// Port configuration
const PORTS = {
  ADMIN: 3000,
  BACKEND: 8000
};

// Cross-platform commands
const COMMANDS = {
  windows: {
    checkPort: (port) => `netstat -ano | findstr :${port}`,
    killProcess: (pid) => `taskkill /F /PID ${pid}`,
    killPort: (port) => `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /F /PID %a`
  },
  darwin: { // macOS
    checkPort: (port) => `lsof -ti:${port}`,
    killProcess: (pid) => `kill -9 ${pid}`,
    killPort: (port) => `lsof -ti:${port} | xargs kill -9`
  },
  linux: {
    checkPort: (port) => `lsof -ti:${port}`,
    killProcess: (pid) => `kill -9 ${pid}`,
    killPort: (port) => `lsof -ti:${port} | xargs kill -9`
  }
};

const currentPlatform = platform();
const commands = COMMANDS[currentPlatform] || COMMANDS.linux;

// Parse command line arguments
const args = process.argv.slice(2);
const isKillOnly = args.includes('--kill-only');
const isCheckOnly = args.includes('--check-only');
const isClean = args.includes('--clean');

/**
 * Execute a command and return a promise
 */
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({ error: true, stdout: '', stderr: error.message });
      } else {
        resolve({ error: false, stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
  });
}

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
  const result = await execCommand(commands.checkPort(port));
  return !result.error && result.stdout.length > 0;
}

/**
 * Kill processes using a specific port
 */
async function killPort(port) {
  console.log(`🔫 Killing processes on port ${port}...`);
  const result = await execCommand(commands.killPort(port));
  if (result.error) {
    console.log(`⚠️  Warning: Could not kill processes on port ${port}: ${result.stderr}`);
    return false;
  }
  console.log(`✅ Killed processes on port ${port}`);
  return true;
}

/**
 * Check and free ports if needed
 */
async function checkAndFreePorts() {
  console.log('🔍 Checking port availability...');
  
  const portChecks = await Promise.all([
    isPortInUse(PORTS.ADMIN),
    isPortInUse(PORTS.BACKEND)
  ]);

  const [adminPortInUse, backendPortInUse] = portChecks;
  
  if (adminPortInUse || backendPortInUse) {
    console.log('⚠️  Some ports are in use. Attempting to free them...');
    
    if (adminPortInUse) {
      await killPort(PORTS.ADMIN);
    }
    
    if (backendPortInUse) {
      await killPort(PORTS.BACKEND);
    }
    
    // Wait a moment for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check again
    const finalChecks = await Promise.all([
      isPortInUse(PORTS.ADMIN),
      isPortInUse(PORTS.BACKEND)
    ]);
    
    if (finalChecks[0] || finalChecks[1]) {
      console.error('❌ Failed to free ports. Please manually stop processes using:');
      if (finalChecks[0]) console.error(`   Port ${PORTS.ADMIN} (Admin Portal)`);
      if (finalChecks[1]) console.error(`   Port ${PORTS.BACKEND} (Backend API)`);
      process.exit(1);
    }
  }
  
  console.log('✅ All ports are available');
}

/**
 * Only check ports without killing
 */
async function checkPortsOnly() {
  console.log('🔍 Checking port availability...');
  
  const portChecks = await Promise.all([
    isPortInUse(PORTS.ADMIN),
    isPortInUse(PORTS.BACKEND)
  ]);

  const [adminPortInUse, backendPortInUse] = portChecks;
  
  console.log(`\n📊 Port Status:`);
  console.log(`   Port ${PORTS.ADMIN} (Admin Portal): ${adminPortInUse ? '❌ IN USE' : '✅ AVAILABLE'}`);
  console.log(`   Port ${PORTS.BACKEND} (Backend API): ${backendPortInUse ? '❌ IN USE' : '✅ AVAILABLE'}`);
  
  if (adminPortInUse || backendPortInUse) {
    console.log('\n💡 To free ports, run: npm run kill:ports');
    process.exit(1);
  }
}

/**
 * Only kill ports without starting servers
 */
async function killPortsOnly() {
  console.log('🔫 Killing processes on development ports...');
  
  const portChecks = await Promise.all([
    isPortInUse(PORTS.ADMIN),
    isPortInUse(PORTS.BACKEND)
  ]);

  const [adminPortInUse, backendPortInUse] = portChecks;
  
  if (!adminPortInUse && !backendPortInUse) {
    console.log('✅ No processes found on development ports');
    return;
  }
  
  if (adminPortInUse) {
    await killPort(PORTS.ADMIN);
  }
  
  if (backendPortInUse) {
    await killPort(PORTS.BACKEND);
  }
  
  console.log('✅ Port cleanup completed');
}

/**
 * Clean mode - kill ports and exit
 */
async function cleanMode() {
  await killPortsOnly();
  console.log('🧹 Cleanup completed');
  process.exit(0);
}

/**
 * Main function
 */
async function main() {
  try {
    // Handle different modes
    if (isClean) {
      await cleanMode();
      return;
    }
    
    if (isCheckOnly) {
      await checkPortsOnly();
      return;
    }
    
    if (isKillOnly) {
      await killPortsOnly();
      return;
    }
    
    // Default mode: check ports, free them if needed, then start servers
    await checkAndFreePorts();
    console.log('🚀 Starting development servers...');
    console.log('\n📱 Services will be available at:');
    console.log(`   🌐 Admin Portal: http://localhost:${PORTS.ADMIN}`);
    console.log(`   🔧 Backend API: http://localhost:${PORTS.BACKEND}/health`);
    console.log('\n⏳ Starting servers... (this may take a few seconds)');
    console.log('🛑 Press Ctrl+C to stop all services\n');
    
    // Get the root directory path
    const rootDir = path.resolve(__dirname, '..');
    
    // Start the development servers using concurrently with proper paths
    const concurrently = spawn('npx', ['concurrently', 
      '--kill-others',
      '--prefix', 'name',
      '--names', 'BACKEND,ADMIN',
      '--prefix-colors', 'bgBlue.bold,bgGreen.bold',
      '--restart-tries', '3',
      '--restart-delay', '1000',
      `"cd ${path.join(rootDir, 'apps/backend')} && npm start"`,
      `"cd ${path.join(rootDir, 'apps/admin-portal')} && npm run dev"`
    ], {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development servers...');
      concurrently.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Stopping development servers...');
      concurrently.kill('SIGTERM');
    });

    concurrently.on('close', (code) => {
      // Only exit if it's a real error (not 0 or 1 from normal shutdown)
      if (code !== 0 && code !== 1) {
        console.log(`\n❌ Development servers stopped with error code ${code}`);
        process.exit(code);
      } else {
        console.log(`\n✅ Development servers stopped gracefully`);
        process.exit(0);
      }
    });

    concurrently.on('error', (error) => {
      console.error('❌ Error starting development servers:', error.message);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  checkAndFreePorts,
  isPortInUse,
  killPort,
  PORTS
};
