import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rag-quiz/',
  server: {
    port: 5173,
    proxy: {
      '/rag-quiz/api': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/rag-quiz/, '')
      }
    }
  }
})
