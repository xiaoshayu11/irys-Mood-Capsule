import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    // 确保生产环境不包含开发服务器相关代码
    rollupOptions: {
      external: (id) => {
        // 排除开发环境相关的模块
        return id.includes('vite/client') || id.includes('@vite/client')
      }
    }
  },
  define: {
    // 确保生产环境变量正确设置
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})



