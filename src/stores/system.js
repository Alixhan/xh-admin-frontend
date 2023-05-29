import { defineStore } from 'pinia'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { userLogin } from '@/api/system/user'
import { useRouter } from 'vue-router'
import { useDark, useLocalStorage, useTitle } from '@vueuse/core'
import _ from 'lodash'
import { devMenus } from '@/router/static'

/**
 * 系统全局store,主要定义项目布局信息，系统登录， 路由管理，权限管理，浏览器标题管理，注销等
 * sxh 2023-03-31
 */
export const useSystemStore = defineStore('system', () => {
  // 布局根路由名称
  const layoutRouteName = import.meta.env.VITE_LAYOUT_ROUTE_NAME
  // 路由白名单，可以直接跳转
  const whiteList = ['']

  const layout = reactive({
    // 全局布局大小，可选值<small|default|large>
    size: useLocalStorage(import.meta.env.VITE_SYS_TOKEN_KEY + '-size', 'default'),
    // 是否暗黑模式
    isDark: useDark(),
    // 布局方式，可选值<Default|Classic|Streamline>
    layoutMode: 'Default',
    // 主页面切换动画，可选值<slide-right|slide-left|el-fade-in-linear|el-fade-in|el-zoom-in-center|el-zoom-in-top|el-zoom-in-bottom>
    mainAnimation: 'slide-left',
    // 侧边菜单宽度(展开时)，单位px
    menuWidth: 200,
    // 是否水平折叠收起菜单
    menuCollapse: false,
    // 是否只保持一个子菜单的展开(手风琴)
    menuUniqueOpened: false,
    // 显示菜单栏顶栏(LOGO)
    showLogo: true,
    // 显示菜单栏顶栏(LOGO)
    showNavTabs: true,
    windowWidth: 0,
    windowHeight: 0,
    // 宽度是否收缩(小宽度设备)
    widthShrink: false,
    // 高度是否收缩(矮高度设备)
    heightShrink: false
  })

  // 监听窗口变化
  window.addEventListener('resize', onResize)
  onResize()
  function onResize() {
    layout.windowWidth = window.innerWidth
    layout.windowHeight = window.innerHeight
    layout.widthShrink = window.innerWidth < 800
    layout.heightShrink = window.innerHeight < 600
    if (layout.widthShrink) layout.menuCollapse = true
  }

  // 浏览器title
  const title = useTitle(import.meta.env.VITE_TITLE)
  // 语言，默认为简体中文
  const language = ref('zh-cn')
  // 当前登录的token ，持久化到本地储存
  const token = useLocalStorage(import.meta.env.VITE_SYS_TOKEN_KEY, '')
  // 登录状态 success, failed
  const loginStatus = ref(null)
  /**
   * 当前登录的用户信息
   * @type {avatar: string}
   */
  const user = ref({})
  // 当前用户的所有菜单
  const menus = ref([])
  // 当前所有菜单，id为key,value为menu
  const menusObj = ref({})
  // 菜单树形结构
  const treeMenus = ref([])
  // 导航路由页签
  const navTabs = ref([])
  // 当前激活的菜单的id
  const activeMenuId = ref()
  // 刷新当前页签
  const refresh = ref()
  // 缓存的组件名称
  const keepAliveComponentNameList = computed(() => {
    return navTabs.value
      .filter((i) => {
        if (refresh.value && i.id === activeMenuId.value) return false
        return i.cache
      })
      .map((i) => i.componentName)
  })

  function setRefresh(val) {
    refresh.value = val
  }
  // 当前激活的菜单组
  const activeMenuArr = computed(() => {
    return getMenuLevelArr(activeMenuId.value)
  })

  const router = useRouter()

  // 路由前置守卫，自动登录
  async function beforeEach(to) {
    // 白名单直接跳转
    if (whiteList.includes(to.fullPath)) {
      return
    }
    let path
    if (token.value && loginStatus.value === null) {
      path = await userLogin()
        .then((res) => {
          // 用户已登录
          if (res.status + '' === 'success' && res.data) {
            // 初始化登录逻辑
            setLoginUserInfo(res.data)
          } else {
            return Promise.reject()
          }
        })
        .catch(() => {
          loginStatus.value = 'failed' // 登录已失效
          // 跳转到登录页
          return '/login'
        })
    }
    // 如果是登录失败的，直接跳转到登录页
    if (loginStatus.value !== 'success') {
      path = '/login'
    }
    // 如果是登录成功的，并且路由是根路径或者登录页的，跳转到菜单第一个路由
    if (loginStatus.value === 'success' && ['/', '/login'].includes(to.fullPath)) {
      path = getFirstRoute().fullPath
    }
    // 重定向路由和原跳转路由路径相同，则无需处理
    if (to.fullPath !== path) {
      return path
    }
  }

  // 设置token
  function setToken(val) {
    token.value = val
  }

  // 设置登录用户信息
  function setLoginUserInfo(loginUserInfo) {
    // 开发环境把开发文档置顶
    if (import.meta.env.DEV) {
      loginUserInfo.menus.unshift(...devMenus)
    }
    loginStatus.value = 'success' // 登录成功
    setToken(loginUserInfo.token)
    user.value = loginUserInfo.user
    menus.value = loginUserInfo.menus
    initMenu()
  }

  // 初始化动态菜单
  function initMenu() {
    menusObj.value = {}
    menus.value.forEach((i) => {
      i.children = []
      menusObj.value[i.id] = i
    })
    // 转为树形结构
    treeMenus.value = menus.value.filter((i) => {
      const parent = menusObj.value[i.parentId]
      if (parent) {
        parent.children.push(i)
        return false
      }
      return true
    })
    initDynamicRouter()
  }

  // 获取菜单id的层级数组
  function getMenuLevelArr(id) {
    const arr = []
    let currentMenu = menusObj.value[id]
    while (currentMenu) {
      arr.unshift(currentMenu)
      currentMenu = menusObj.value[currentMenu.parentId]
    }
    return arr
  }

  // 初始化动态路由
  function initDynamicRouter() {
    const viewsComponent = import.meta.glob('/src/views/**/*.vue')
    router.addRoute({
      name: layoutRouteName,
      path: `/${layoutRouteName}`,
      component: () => import('@/layout')
    })
    menus.value.forEach((i) => {
      // 权限name,用冒号拼接上父级name
      i.auth = getMenuLevelArr(i.id)
        .map((i) => i.name)
        .join(':')
      if (i.type === 'menu' && ['route', 'iframe'].includes(i.handleType)) {
        // 路由名称
        const name = getMenuLevelArr(i.id)
          .map((i) => i.name)
          .join('/')
        // 路由路径
        const path = getMenuLevelArr(i.id)
          .map((i) => i.path)
          .join('/')
        // 路由全路径
        const fullPath = `/${layoutRouteName}/${path}`
        // 组件name
        const componentName = _.camelCase(fullPath)
        const dynamicRoute = {
          name,
          path,
          fullPath,
          component: () => {
            const component = viewsComponent[i.component]
            if (!component) throw new Error(`${i.component} 文件不存在！`)
            return component().then((comp) => ({
              ...comp.default,
              name: componentName
            }))
          },
          meta: {
            menuId: i.id,
            title: i.title,
            cache: i.cache,
            component: i.component
          }
        }
        i.fullPath = fullPath
        i.componentName = componentName
        router.addRoute(layoutRouteName, dynamicRoute)
      }
    })
  }

  // 获取当前用户菜单首个路由
  function getFirstRoute() {
    const arr = [...treeMenus.value]
    while (arr.length) {
      const menu = arr.shift()
      if (menu.type === 'menu') return menu
      if (menu.children?.length) {
        arr.unshift(...menu.children)
      }
    }
  }

  // 监听activeMenuId变化，设置路由等
  watch(
    () => activeMenuId.value,
    (menuId) => {
      const menu = menusObj.value[menuId]
      menu && router.push(menu.fullPath)
    }
  )

  // 路由跳转成功后钩子，设置当前路由信息，navTabs等，浏览器标题等
  function afterEach(guard) {
    const fullPath = guard.fullPath
    const tab = navTabs.value.find((i) => i.fullPath === fullPath)
    const menu = menus.value.find((i) => i.fullPath === fullPath)
    // 如果不存在，则添加tab
    if (!tab && menu) nextTick().then(() => navTabs.value.push(menu))
    // 如果是跳转到动态菜单，设置activeId
    if (menu) activeMenuId.value = menu.id

    // 设置浏览器标题
    let tit = import.meta.env.VITE_TITLE
    if (guard.meta.title) tit = guard.meta.title + '-' + tit
    title.value = tit
  }

  // 设置当前激活菜单id
  function setActiveMenuId(val) {
    activeMenuId.value = val
  }

  // 通过menuId移除navTab
  function removeNavTabByMenuId(menuId) {
    let index = navTabs.value.findIndex((i) => i.id === menuId)
    const currentMenu = navTabs.value[index]
    navTabs.value.splice(index, 1)
    // 如果删除了当前激活的路由，则需要自动跳转到右边的tab
    if (currentMenu.id === activeMenuId.value) {
      // 如果是最右边路由，则需要左移一位
      if (index > navTabs.value.length - 1) index--
      activeMenuId.value = navTabs.value[index].id
    }
  }

  // 注销
  function logout() {
    // router.push('/login').then(() => {
    //   router.removeRoute(layoutRouteName) // 移除动态路由
    //   activeMenuId.value = null
    // })
    // 重置
    // token.value = null
    // loginStatus.value = null
    // user.value = null
    // menus.value = []
    // menusObj.value = []
    // treeMenus.value = []
    // navTabs.value = []
    window.location.reload()
  }

  return {
    layout,
    language,
    token,
    user,
    treeMenus,
    menus,
    navTabs,
    activeMenuId,
    activeMenuArr,
    keepAliveComponentNameList,
    getFirstRoute,
    beforeEach,
    afterEach,
    setToken,
    setLoginUserInfo,
    setActiveMenuId,
    removeNavTabByMenuId,
    logout,
    refresh,
    setRefresh
  }
})
