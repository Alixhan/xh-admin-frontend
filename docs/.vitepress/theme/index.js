import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element图标
import '@/styles/index.scss' // 样式引入
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
// import { createPinia } from 'pinia'
// import MyComponents from '@/components/index'
// import { AuthDirective } from '@/directive'
// import I18n from '@/i18n/index'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    const app = ctx.app
    app.use(ElementPlus)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    // app.use(I18n)
    // app.use(createPinia())
    // app.use(ElementPlus)
    // for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    //   app.component(key, component)
    // }
    // // 全局注册自定义组件
    // app.use(MyComponents)
    // // 全局注册权限自定义指令
    // app.directive('auth', AuthDirective)
  },
}
