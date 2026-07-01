import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base to your GitHub repo name when deploying, e.g. '/normal-gossip/'
  base: process.env.VITE_BASE_PATH || '/',
})
