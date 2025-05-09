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
      '@': resolve(__dirname, 'client/src'), // ✅ Allows imports like '@/components/ui'
      '@shared': resolve(__dirname, 'shared'), // ✅ Allows imports like '@shared/interfaces'
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: resolve(__dirname, 'dist'),
  },
});