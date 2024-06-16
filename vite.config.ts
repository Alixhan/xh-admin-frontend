import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//@ts-ignore
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'
import {fileURLToPath, URL} from 'node:url'
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
        eslint(),
        checker({vueTsc: true}),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@i': fileURLToPath(new URL('./interface', import.meta.url)),
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
                        'not dead',
                        // '> 0.1% in CN',
                    ],
                    grid: true,
                }),
            ]
        }
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
