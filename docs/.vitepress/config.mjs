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
    titleTemplate: '晓寒开源管理系统',
    description: '晓寒开源管理系统',
    head: [
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/icon/logo-light.svg'}],
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: {
            light: '/icon/logo-light.svg',
            dark: '/icon/logo-dark.svg'
        },
        nav: [
            {text: '开始✨', activeMatch: '/guide', link: '/guide/introduction'},
            {text: '前端手册', activeMatch: '/frontend', link: '/frontend/'},
            {text: '后端手册', activeMatch: '/backend', link: '/backend/'},
            {text: '演示站', link: 'http://demo.xhansky.cn'},
        ],
        socialLinks: [
            { link: 'https://gitee.com/sun-xiaohan/xh-admin-frontend', icon: { svg: '<svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" fill="#c71d23" r="16"/><path d="m24.0987698 14.2225144h-9.0863697c-.4362899.000207-.7900048.3538292-.790326.7901191l-.0005173 1.9752185c-.0003277.4363707.353328.7902117.7896987.790326.0000712 0 .0001424 0 .0002135-.0002135l5.5317648-.0000461c.4363708-.0000102.7901221.3537352.7901257.790106 0 .0000022 0 .0000044-.0000066.0000066v.1975077.1975318c0 1.3091122-1.0612451 2.3703573-2.3703573 2.3703573h-7.5067195c-.4363081-.0000218-.790009-.353713-.7900429-.7900211l-.0002069-7.5059917c-.0001014-1.3091122 1.0611145-2.3703865 2.3702267-2.3704226.0000217 0 .0000435 0 .0000653.0000653h11.0602463c.4361793-.0004902.7898484-.35394.7906091-.79011894l.0012251-1.97521881c.0007606-.43637034-.3527683-.79033806-.7891389-.79060871-.0001634-.0000001-.0003268-.00000015-.0004901.00048976h-11.0617654c-3.27278051 0-5.92589329 2.65311278-5.92589329 5.9258933v11.0612755c0 .4363707.35374837.7901191.7901191.7901191h11.65447149c2.9454379 0 5.3331872-2.3877493 5.3331872-5.3331872v-4.5430682c0-.4363707-.3537484-.7901191-.7901191-.7901191z" fill="#fff"/></g></svg>' } },
            { link: 'https://github.com/Alixhan/xh-admin-frontend', icon: 'github' },
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
