import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sử dụng import động cho tailwind plugin
export default defineConfig(async () => {
  // Import tailwind plugin sử dụng dynamic import
  const { default: tailwindcss } = await import('@tailwindcss/vite');
  
  return {
    plugins: [
      tailwindcss(), 
      react()
    ],
    server: {
      port: 5173,
      open: true,
    },
  };
});