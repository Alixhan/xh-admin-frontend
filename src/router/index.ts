import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { loading } from '@/utils/loading'
import NProgress from 'nprogress'
import { useSystemStore } from '@/stores/system'
import type { NavTab } from '@/stores/system'
import Layout from '@/layout/index.vue'
// 静态路由
export const staticRouters = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '系统登录'
    }
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
        }
      },
      {
        path: `/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/personalCenter`,
        name: 'personalCenter',
        component: () => import('@/views/personalCenter/index.vue'),
        meta: {
          title: '个人中心',
          cache: true,
          componentName: `PersonalCenter`,
          icon: 'el|Avatar'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRouters
})

router.beforeEach(async (to, from, next) => {
  NProgress.configure({ speed: 500, showSpinner: false })
  NProgress.start()
  const systemStore = useSystemStore()
  const path = await systemStore.beforeEach(to)
  if (path) next(path)
  else next()
})

router.afterEach((to) => {
  loading.delayHide()
  NProgress.done()
  const systemStore = useSystemStore()
  systemStore.afterEach(to as RouteLocationNormalized & { meta: NavTab })
})

export default router
