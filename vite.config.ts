import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-calendar': ['@fullcalendar/react', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/list', '@fullcalendar/multimonth', '@fullcalendar/interaction'],
          'vendor-pdf': ['react-pdf', 'pdfjs-dist'],
          'vendor-utils': ['axios', 'date-fns', 'react-hot-toast', 'react-dropzone'],
          'icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
