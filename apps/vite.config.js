import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 代理后端接口
    proxy: {
      '/wechat': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
