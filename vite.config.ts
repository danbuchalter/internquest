// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Convert __dirname to work in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Get the current directory

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  root: 'client',  // Ensure Vite serves from the client folder
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),  // Ensure path is resolved correctly
      '@shared': path.resolve(__dirname, 'shared'),  // Shared directory path
    },
  },
  server: {
    port: 3000,  // Customize port if necessary
  },
  build: {
    target: 'esnext',  // Modern JavaScript output
    sourcemap: true,  // Enable source maps for debugging
  },
});