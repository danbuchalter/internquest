import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),  // This is needed for React to work with Vite
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),  // Customize this based on your structure
      '@shared': path.resolve(__dirname, 'shared'),  // Adjust if you have a shared directory
    },
  },
  server: {
    port: 3000,  // Adjust port if needed
  },
  build: {
    target: 'esnext',  // This targets modern browsers for optimized output
    sourcemap: true,  // Optionally generate source maps for easier debugging
  },
});
