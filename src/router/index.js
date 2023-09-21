import { createRouter, createWebHashHistory } from 'vue-router'
import { loading } from '@/utils/loading'
import NProgress from 'nprogress'
import { useSystemStore } from '@/stores/system'
import Layout from '@/layout/index.vue'
// 静态路由
export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '系统登录',
    },
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    name: '',
    path: '',
    component: Layout,
    children: [
      // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFond.vue'),
        meta: {
          title: 'Not Found',
          icon: 'local|/src/assets/icon/404.svg'
        },
      },
      {
        path: `/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/personalCenter`,
        name: 'personalCenter',
        component: () => import('@/views/personalCenter'),
        meta: {
          title: '个人中心',
          cache: true,
          componentName: `/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/personalCenter`,
          icon: 'el|Avatar'
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRouters,
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
    setTimeout(() => loading.hide(), 1000)
  }
  NProgress.done()
  const systemStore = useSystemStore()
  systemStore.afterEach(guard)
})

export default router
