import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/BOOKINGH-APPLICATION/',    // 👈 replace with your actual repo name!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
