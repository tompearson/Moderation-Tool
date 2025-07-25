import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    host: '127.0.0.1',
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': 'http://127.0.0.1:3001'
    }
  }
})
