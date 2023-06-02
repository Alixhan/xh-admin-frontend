import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // element图标
import MyComponents from '@/components'
import MyDirective from '@/directive'
import '@/styles/index.scss' // 样式引入
import { loading } from '@/utils/loading'
// import 'default-passive-events'

loading.show()
const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局注册自定义组件
MyComponents.install(app)
// 全局注册自定义指令
app.use(MyDirective)
// 必须放到最后挂载
app.mount('#app')
