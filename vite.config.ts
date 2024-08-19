import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    vue({
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
    checker({
      // vueTsc: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx,vue,js.jsx}"'
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@i': fileURLToPath(new URL('./interface', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          // 自动添加前缀
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie > 11',
            'not dead',
          ],
          flexbox: true,
          grid: true,
          ignoreUnknownVersions: true
        })
      ]
    }
  },
  server: {
    host: true,
    open: true
  },
  build: {
    assetsInlineLimit: 0
  }
})
