import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  define: {
    // Changes on every production build so the app can detect a stale local
    // build and reset itself — see src/state/store.tsx. In dev this stays
    // constant for the life of the dev server (no rebuild happens per file save).
    __BUILD_ID__: JSON.stringify(String(Date.now())),
  },
})
