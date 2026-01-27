import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore - This is a workaround for TypeScript import issue
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})