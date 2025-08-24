import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Force port 3000 - fail if not available
    host: 'localhost', // Use localhost instead of all interfaces
    open: false, // Don't auto-open browser
    hmr: {
      port: 3002 // Use different port for HMR to avoid conflicts with main port
    }
  }
})
