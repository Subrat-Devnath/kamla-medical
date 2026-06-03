import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // This poperty for reflect code when i save no need to run npm run dev agian
  server: {
    watch: {
      usePolling: true,   // 🔥 IMPORTANT FIX
      interval: 1000,     // optional (1s polling)
    },
  },
  
})
