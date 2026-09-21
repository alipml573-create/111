import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  base: './',
  resolve: { alias: { '@': path.resolve(__dirname, 'support') } },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: {
    target: 'es2022', sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // React library directives have no server/client boundary in this client-only app.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) return;
        warn(warning);
      },
    },
  },
});
