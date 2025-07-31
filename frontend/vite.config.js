import { defineConfig } from 'vite'

export default defineConfig({
  // Ensure proper base path for deployment
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['bootstrap', 'axios']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    cors: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  }
})