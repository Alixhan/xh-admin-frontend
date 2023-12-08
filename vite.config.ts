import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//@ts-ignore
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
      template: {
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href'],
          // 添加对自定义的组件路径别名解析
          'm-svg-icon': ['src']
        }
      }
    }),
    vueJsx(),
    eslint(),
    checker({ vueTsc: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@i': fileURLToPath(new URL('./interface', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.mts', '.jsx', '.tsx', '.json', '.vue'],
  },
  // vite 相关配置
  server: {
    host: true,
    open: true,
  },
  build: {
    assetsInlineLimit: 0
  }
})
