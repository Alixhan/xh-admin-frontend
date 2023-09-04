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
  description: "晓寒中后台管理系统文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '演示', link: '/demo' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
