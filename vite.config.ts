// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: resolve(__dirname, 'client'), // ✅ Root stays in client/
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'), // ✅ Shortcuts
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: resolve(__dirname, 'client/dist'), // ✅ Ensures Vite builds to the correct folder
    emptyOutDir: true, // ✅ Optional: cleans the dist folder before building
  },
});