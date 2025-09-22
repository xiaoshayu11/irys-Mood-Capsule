import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App'
import './index.css'

const container = document.getElementById('root')!
const root = createRoot(container)

// 只在开发环境使用严格模式
const isDevelopment = import.meta.env.DEV

if (isDevelopment) {
  root.render(<React.StrictMode><App /></React.StrictMode>)
} else {
  root.render(<App />)
}



