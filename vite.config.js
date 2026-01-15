import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/monaco-editor/min/vs/editor/editor.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/monaco-editor/min/vs/language/json/json.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/monaco-editor/min/vs/language/css/css.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/monaco-editor/min/vs/language/html/html.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/monaco-editor/min/vs/language/typescript/ts.worker.js',
          dest: 'assets'
        }
      ]
    })
  ]
});