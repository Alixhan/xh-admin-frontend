import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element图标
import MyComponents from '@/components'
import { AuthDirective } from '@/directive'
import I18n from '@/i18n/index'
import '@/styles/index.scss' // 样式引入
import '@/styles/app.scss'
import { loading } from '@/utils/loading'
import router from '@/router'
// import 'default-passive-events'

loading.show()
const app: VueApp<Element> = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局注册自定义组件
app.use(MyComponents)
// 国际化配置
app.use(I18n)
// 全局注册权限自定义指令
app.directive('auth', AuthDirective)
// 必须放到最后挂载
app.mount('#app')
