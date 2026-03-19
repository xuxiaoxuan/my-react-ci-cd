import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/my-react-ci-cd/', // 这里的名字必须和你的 GitHub 仓库名一模一样
  plugins: [react()],
})
