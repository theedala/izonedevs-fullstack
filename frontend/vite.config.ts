import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/izonedevs-fullstack-frontend/',
  server: {
    port: 8080,
    host: '0.0.0.0',
    strictPort: false,
    open: true,
  },
})
