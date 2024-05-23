import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
mkd;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  plugins: [react()],
});
