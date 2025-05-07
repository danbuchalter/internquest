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
  // Adjusted root directory configuration (if 'client' folder is not required)
  root: __dirname,  // Use the root directory where your frontend code resides
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Make sure your src folder is here
      '@shared': path.resolve(__dirname, 'shared'),  // Shared directory path, remove if not used
    },
  },
  server: {
    port: 3000,  // Port for the dev server
  },
  build: {
    target: 'esnext',  // Modern JavaScript output
    sourcemap: true,  // Enable source maps for debugging
  },
});
