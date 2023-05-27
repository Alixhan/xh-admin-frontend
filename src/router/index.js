import { createRouter, createWebHashHistory } from 'vue-router'
import { loading } from '@/utils/loading'
import NProgress from 'nprogress'
import { useSystemStore } from '@/stores/system'
// 静态路由
export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '系统登录'
    }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRouters
})

router.beforeEach(async (to, from, next) => {
  NProgress.configure({ showSpinner: false })
  NProgress.start()
  const systemStore = useSystemStore()
  const path = await systemStore.beforeEach(to)
  next(path)
})

router.afterEach((guard) => {
  if (window.existLoading) {
    loading.hide()
  }
  NProgress.done()
  const systemStore = useSystemStore()
  systemStore.afterEach(guard)
})

export default router
