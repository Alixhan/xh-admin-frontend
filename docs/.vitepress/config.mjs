import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from "node:url";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins:[
      vueJsx()
    ],
    // Vite config options
    resolve: {
      alias: {
        // @ts-ignore
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.mts', '.jsx', '.tsx', '.json', '.vue', '.md'],
    },
    // vite 相关配置
    server: {
      host: true,
      port: 2323
    },
  },
  vue: {

  },
  title: "xh-admin",
  description: "晓寒管理系统",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/icon/logo-black.svg',
      dark: '/icon/logo-white.svg',
    },
    nav: [
      { text: '开始✨', activeMatch: '/guide', link: '/guide/introduction' },
      { text: '配置', activeMatch: '/reference', link: '/reference/' },
    ],
    sidebar: {
      guide: [
        {
          text: '指南',
          base: '/guide',
          items: [
            { text: '介绍', link: '/introduction' },
            // { text: '安装', link: '/install' },
            // { text: '部署', link: '/deploy' },
          ]
        },
        {
          text: '其他',
          items: [
            { text: '安装', link: '/reference/install' },
          ]
        },
      ],
      reference: [
        {
          text: '配置',
          base: '/reference',
          items: [
            { text: '通用配置', link: '/' },
            { text: '安装', link: '/install' },
            { text: '部署', link: '/deploy' },
          ]
        },
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
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
    },
    outlineTitle: '本页目录',
    docFooter: {
      prev: '上一节',
      next: '下一节',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present sxh',
    },
  },
  lastUpdated: true,
  cleanUrls: true,
})
