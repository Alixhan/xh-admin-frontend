import {defineConfig} from 'vitepress'
import {fileURLToPath, URL} from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
// import LogoDark from '@/assets/icon/logo-white.svg'
// import LogoLight from '@/assets/icon/logo-black.svg'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    vite: {
        plugins: [
            vueJsx()
        ],
        // Vite config options
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('../../src', import.meta.url)),
                '@i': fileURLToPath(new URL('../../interface', import.meta.url)),
            },
            extensions: ['.mjs', '.js', '.ts', '.mts', '.jsx', '.tsx', '.json', '.vue', '.md']
        },
        // vite 相关配置
        server: {
            host: true,
            port: 2323
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
                        ],
                        grid: true,
                    }),
                ]
            }
        }
    },
    vue: {},
    title: 'XHan Admin',
    titleTemplate: '晓寒管理系统',
    description: '晓寒管理系统',
    head: [
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '../assets/icon/logo-light.svg'}],
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: {
            light: '/icon/logo-light.svg',
            dark: '/icon/logo-dark.svg'
        },
        nav: [
            {text: '开始✨', activeMatch: '/guide', link: '/guide/introduction'},
            {text: '配置', activeMatch: '/reference', link: '/reference/'},
        ],
        sidebar: {
            guide: [
                {
                    text: '开始',
                    base: '/guide',
                    items: [
                        {text: '介绍', link: '/introduction'},
                        {text: '快速了解', link: '/quick-info'},
                        {text: '安装', base: '/guide/install', link: '/'}
                    ]
                },
                {
                    text: '部署',
                    base: '/guide/deploy',
                    items: [
                        {text: '前言', link: '/'},
                        {text: '安装docker', link: '/install-docker'},
                        {text: '部署中间件', link: '/middleware'},
                        {text: '部署微服务', link: '/microservice'}
                    ]
                },
                {
                    text: '其他',
                    base: '/guide',
                    items: [
                        {text: '特别鸣谢', link: '/special-thanks'},
                        {text: '常见问题', link: '/faq'},
                        {text: '更新日志', link: '/release'},
                        {text: '加入交流群', link: '/join-group'}
                    ]
                }
            ]
        },
        outline: {
            label: '本页目录',
            level: 'deep'
        },
        lastUpdated: {
            text: '最后更新'
        },
        docFooter: {
            prev: '上一节',
            next: '下一节'
        },
        editLink: {
            pattern: 'https://gitee.com/sun-xiaohan/xh-admin-frontend/tree/main/docs/:path',
            text: '帮助改进此页面'
        },
        darkModeSwitchLabel: '切换主题',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: '搜索',
                    },
                    modal: {
                        displayDetails: '显示明细列表',
                        resetButtonTitle: '重置搜索',
                        backButtonTitle: '关闭搜索',
                        noResultsText: '无结果',
                        footer: {
                            selectText: '选择',
                            navigateText: '上下',
                            closeText: '关闭',
                        }
                    }
                }
            }
        }
    },
    lastUpdated: true,
    markdown: {
        lineNumbers: true
    }
})
