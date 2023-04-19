import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(config => {
  const env = loadEnv(config.mode, process.cwd())
  return {
    build: {
      outDir: 'dist',
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    // vite 相关配置
    server: {
      host: true,
      https: false,
      open: true,
    },
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
      VueSetupExtend(),
      eslintPlugin(),
      vueJsx(),
    ]
  }
})
