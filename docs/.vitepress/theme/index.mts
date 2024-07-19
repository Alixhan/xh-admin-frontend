import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element图标
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import {createPinia} from 'pinia'
import MyComponents from '@/components/index'
import {AuthDirective} from '@/directive'
import I18n from '@/i18n/index'
import VpDemo from './vp/VpDemo.vue'
import VpApiTyping from './vp/VpApiTyping.vue'
import VpMermaid from './vp/VpMermaid.vue'

export default {
    ...DefaultTheme,
    Layout: MyLayout,
    enhanceApp({app}) {
        app.use(I18n)
        app.use(createPinia())
        app.use(ElementPlus)
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
        // 全局注册自定义组件
        app.use(MyComponents)
        // 全局注册权限自定义指令
        app.directive('auth', AuthDirective)
        // 演示组件
        app.component('VpDemo', VpDemo)
        app.component('VpApiTyping', VpApiTyping)
        app.component('VpMermaid', VpMermaid)
    }
}
