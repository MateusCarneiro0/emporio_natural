//Use in .vite.config.js 6 version
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({
      failOnError: false, // REMOVER DEPOIS
      failOnWarning: false,
    })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'], 
  }
});
