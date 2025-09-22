import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    // 确保生产环境不包含开发服务器相关代码
    rollupOptions: {
      external: (id) => {
        // 排除开发环境相关的模块
        return id.includes('vite/client') || 
               id.includes('@vite/client') ||
               id.includes('@vite/env') ||
               id.includes('vite/hmr')
      }
    }
  },
  define: {
    // 确保生产环境变量正确设置
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    'import.meta.env.DEV': mode !== 'production',
    'import.meta.env.PROD': mode === 'production'
  },
  // 完全禁用HMR在生产环境
  ...(mode === 'production' && {
    esbuild: {
      drop: ['console', 'debugger']
    }
  })
}))



