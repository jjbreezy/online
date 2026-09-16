import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../portfolio',
    emptyOutDir: true,
    target: 'esnext',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (
              id.includes('/three/') ||
              id.includes('@react-three/') ||
              id.includes('three-stdlib') ||
              id.includes('three-mesh-bvh') ||
              id.includes('troika-three-text') ||
              id.includes('troika-worker-utils') ||
              id.includes('camera-controls') ||
              id.includes('meshline') ||
              id.includes('stats.js') ||
              id.includes('its-fine') ||
              id.includes('suspend-react')
            ) {
              return 'vendor-three';
            }
            if (
              id.includes('lenis') ||
              id.includes('lucide-react')
            ) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
