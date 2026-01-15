import { defineConfig } from 'vite';

export default defineConfig({
  base: '/genzify/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ["monaco-editor"]
        }
      }
    }
  },
  server: {
    port: 3000,
    cors: true,
  },
});