import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      script: {
        // 开启defineModel
        defineModel: true,
      },
    }),
    vueJsx(),
    eslint(),
    checker({ vueTsc: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  // vite 相关配置
  server: {
    host: true,
    https: false,
    open: true,
  }
})
