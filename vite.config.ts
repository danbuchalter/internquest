// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, 'client'), // ✅ Point Vite to client/
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'), // ✅ Points to client/src
      '@shared': resolve(__dirname, 'shared'), // ✅ FIXED: Points to root/shared
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: resolve(__dirname, 'dist'), // Optional: where final files go
  },
});