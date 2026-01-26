import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      'pages': path.resolve(__dirname, './src/pages'),
      'components': path.resolve(__dirname, './src/components'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'services': path.resolve(__dirname, './src/services'),
      'types': path.resolve(__dirname, './src/types'),
      'utils': path.resolve(__dirname, './src/utils'),
      'providers': path.resolve(__dirname, './src/providers'),
      'shared': path.resolve(__dirname, './src/shared'),
      'assets': path.resolve(__dirname, './src/assets'),
      'app': path.resolve(__dirname, './src/app'),
      'messages': path.resolve(__dirname, './src/messages'),
      'http': path.resolve(__dirname, './src/http'),
      'widgets': path.resolve(__dirname, './src/widgets'),
    }
  }
});
