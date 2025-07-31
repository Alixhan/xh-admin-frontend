import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint2'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import checker from 'vite-plugin-checker'

export default defineConfig(({ mode }) => {
  // 开发环境时，将当前项目代码路径放入环境变量
  if (mode === 'development') {
    process.env.VITE_FRONTEND_PATH = process.cwd().replace(/\\/g, '/')
  }
  return {
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
      eslint(),
      checker({
        vueTsc: {
          buildMode: true
        }
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
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie > 11', 'not dead'],
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
  }
})
