import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Lets the app call /api/* in dev without CORS. No rewrite: the backend
      // serves these same routes under /api.
      // 127.0.0.1, not localhost: Node resolves localhost to ::1, which the
      // IPv4-bound backend does not listen on.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
