import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tchat/',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // Converts .chat-header to styles.chatHeader
    }
  }
})
