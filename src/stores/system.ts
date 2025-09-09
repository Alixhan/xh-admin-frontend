import { defineStore } from 'pinia'
import { computed, reactive, ref, watchEffect } from 'vue'
import { switchUserRole, userLogin } from '@/api/system/user'
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import type { RemovableRef } from '@vueuse/core'
import { useCssVar, useDark, useLocalStorage, useTitle } from '@vueuse/core'
import { camelCase } from 'lodash-es'
import { devMenus } from '@/router/static'
import type { LocaleKey } from '@/i18n'
import i18n from '@/i18n'
import { ElNotification } from 'element-plus'

export interface User {
  id?: number
  code?: string
  name?: string
  avatar?: string
  password?: string
}

export interface Menu {
  id: number
  title: string
  name: string
  parentId?: number
  cache: boolean
  componentName?: string
  fullPath: string
  type: string
  component: string
  handleType: string
  path: string
  icon: string
  outerUrl: string
  children?: Menu[]
}

// 用户角色
export interface OrgRole {
  //数据类型，1：用户，2：用户组
  type: number
  //用户id或者用户组的id
  userId: number
  //机构id
  sysOrgId: number
  //角色id
  sysRoleId: number
  //机构代码
  orgCode: string
  //机构名称
  orgName: string
  //角色名称
  roleName: string
  //是否当前使用的角色
  active: boolean
}

export interface NavTab {
  //标题
  title: string
  //路由全路径
  fullPath: string
  //是否缓存
  cache?: boolean
  // 组件名
  componentName?: string
  // 图标
  icon?: string
  // 路由处理类型
  handleType: 'route' | 'iframe'
  // 外链地址
  outerUrl?: string
}

declare type LayoutSize = 'small' | 'default' | 'large'
declare type TabStyle = 'square' | 'mellow' | 'lively'

export interface Layout {
  // 全局布局大小
  size: LayoutSize
  // 是否暗黑模式
  isDark: boolean
  // 布局方式
  layoutMode: 'Default'
  // 主页面切换动画
  mainAnimation:
    | 'slide-right'
    | 'slide-left'
    | 'el-fade-in-linear'
    | 'el-fade-in'
    | 'el-zoom-in-center'
    | 'el-zoom-in-top'
    | 'el-zoom-in-bottom' // 侧边菜单宽度(展开时)，单位px
  menuWidth: number
  // 是否水平折叠收起菜单
  menuCollapse: boolean
  // 是否只保持一个子菜单的展开(手风琴)
  menuUniqueOpened: boolean
  // 显示菜单栏顶栏(LOGO)
  showLogo: boolean
  // 显示菜单栏顶栏(LOGO)
  showNavTabs: boolean
  // 显示Footer
  showFooter: boolean
  //当前窗口宽度
  windowWidth: number
  //当前窗口高度
  windowHeight: number
  // 宽度是否收缩(小宽度设备)
  widthShrink: boolean
  // 高度是否收缩(矮高度设备)
  heightShrink: boolean
  //显示navTab的图标
  showNavTabIcon: boolean
  //布局设置显隐标识
  settingVisible: boolean
  //页签的风格
  tabStyle: TabStyle
  //菜单主题反转
  menuInvertColor: boolean
}

/**
 * 系统全局store,主要定义项目布局信息，系统登录， 路由管理，权限管理，浏览器标题管理，注销等
 * sxh 2023-03-31
 */
export const useSystemStore = defineStore('system', () => {
  // 布局根路由名称
  const layoutRouteName: string = import.meta.env.VITE_LAYOUT_ROUTE_NAME
  // 路由白名单，可以直接跳转
  const whiteList = ['']
  //布局设置
  const layout: Layout = reactive({
    size: useLocalStorage<LayoutSize>('size', 'default'),
    isDark: useDark(),
    layoutMode: 'Default',
    mainAnimation: 'slide-right',
    menuWidth: useLocalStorage('menuWidth', 220),
    menuCollapse: false,
    menuUniqueOpened: useLocalStorage('menuUniqueOpened', false),
    showLogo: useLocalStorage('showLogo', true),
    showNavTabs: true,
    showFooter: useLocalStorage('showFooter', false),
    windowWidth: 0,
    windowHeight: 0,
    widthShrink: false,
    heightShrink: false,
    showNavTabIcon: useLocalStorage('showNavTabIcon', true),
    settingVisible: false,
    tabStyle: useLocalStorage<TabStyle>('tabStyle', 'mellow'),
    menuInvertColor: useLocalStorage('menuInvertColor', true)
  })

  const elFontSizeBase = useCssVar('--el-font-size-base')
  const elMenuItemHeight = useCssVar('--el-menu-item-height')
  watchEffect(resizeFontSizeBase)

  function resizeFontSizeBase() {
    const sizeObj = {
      small: '12px',
      default: '13px',
      large: '14px'
    }
    const menuHeightObj = {
      small: '34px',
      default: '40px',
      large: '46px'
    }
    elFontSizeBase.value = sizeObj[layout.size]
    elMenuItemHeight.value = menuHeightObj[layout.size]
  }

  // 监听窗口变化
  globalThis.addEventListener?.('resize', onResize)
  onResize()

  function onResize() {
    layout.windowWidth = globalThis.innerWidth
    layout.windowHeight = globalThis.innerHeight
    layout.widthShrink = globalThis.innerWidth < 800
    layout.heightShrink = globalThis.innerHeight < 600
    if (layout.widthShrink) layout.menuCollapse = true
  }

  // 浏览器title
  useTitle(import.meta.env.VITE_TITLE)
  // 语言，默认为简体中文
  const locale: RemovableRef<LocaleKey> = useLocalStorage<LocaleKey>('locale', 'zh-cn')
  // 当前登录的token ，持久化到本地储存
  const token = useLocalStorage(import.meta.env.VITE_SYS_TOKEN_KEY, '')
  // 登录状态 success, failed
  const loginStatus = ref<'success' | 'failed'>()
  //当前登录的用户信息
  const user = ref<User>({})
  //当前用户拥有的角色
  const orgRoles = ref<OrgRole[]>([])
  // 当前用户的所有菜单
  const menus = ref<Menu[]>([])
  // 当前所有菜单，id为key,value为menu
  const menusObj = ref<{ [id: number]: Menu }>({})
  // 菜单树形结构
  const treeMenus = ref<Menu[]>([])
  // 导航路由页签
  const navTabs = ref<NavTab[]>([])
  // 刷新当前页签
  const refresh = ref<boolean>()
  // 缓存的组件名称
  const keepAliveComponentNameList = computed(() => {
    return navTabs.value
      .filter((i) => {
        if (refresh.value && i.fullPath === route.fullPath) return false
        return i.cache
      })
      .map((i) => i.componentName as string)
  })

  function setRefresh(val: boolean) {
    refresh.value = val
  }

  //切换语言
  function setLocale(val: LocaleKey) {
    locale.value = val
  }

  // 当前激活的菜单组
  const activeMenuArr = computed(() => {
    const menu = menus.value.find((i) => i.fullPath === route.fullPath)
    if (menu) return getMenuLevelArr(menu.id)
    return [route.meta]
  })

  const router = useRouter()
  const route = useRoute()

  // 路由前置守卫，自动登录
  async function beforeEach(to: RouteLocationNormalized) {
    // 白名单直接跳转
    if (whiteList.includes(to.fullPath)) {
      return
    }
    let path: string | undefined
    if (token.value && !loginStatus.value) {
      path = await userLogin({})
        .then((res) => {
          // 用户已登录
          if (res.status + '' === 'success' && res.data) {
            // 初始化登录逻辑
            setLoginUserInfo(res.data)
            return to.fullPath
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
    } else {
      // 如果是登录成功的，并且路由是根路径或者登录页的，跳转到菜单第一个路由
      if (['/', '/login'].includes(to.fullPath)) {
        path = getFirstRoute()?.fullPath
      } else {
        return path
      }
    }
    // 重定向路由和原跳转路由路径相同，则无需处理
    if (to.fullPath !== path) {
      return path
    }
  }

  // 路由跳转成功后钩子，设置当前路由信息，navTabs等，浏览器标题等
  function afterEach(guard: RouteLocationNormalized & { meta: NavTab }) {
    const fullPath = guard.fullPath
    const tab = navTabs.value.find((i) => i.fullPath === fullPath)
    // 如果不存在，则添加tab
    if (!tab && guard.fullPath.startsWith(`/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/`))
      navTabs.value.push({
        title: guard.meta.title,
        fullPath: guard.fullPath,
        componentName: guard.meta.componentName,
        cache: guard.meta.cache,
        icon: guard.meta.icon,
        handleType: guard.meta.handleType,
        outerUrl: guard.meta.outerUrl
      })
    // 设置浏览器标题
    let tit = import.meta.env.VITE_TITLE
    if (guard.meta.title) tit = guard.meta.title + '-' + tit
    useTitle(tit)
  }

  // 设置token
  function setToken(val: string) {
    token.value = val
  }

  // 设置登录用户信息
  function setLoginUserInfo(loginUserInfo: any) {
    const { t } = i18n.global
    loginUserInfo.menus ??= []
    // 开发环境把开发文档置顶
    if (import.meta.env.DEV) {
      loginUserInfo.menus.unshift(...devMenus)
    }
    if (!loginUserInfo.menus.length) {
      ElNotification({
        type: 'error',
        message: t('common.noMenus')
      })
      throw new Error(t('common.noMenus'))
    }
    loginStatus.value = 'success' // 登录成功
    setToken(loginUserInfo.tokenValue)
    user.value = loginUserInfo.user
    menus.value = loginUserInfo.menus
    orgRoles.value = loginUserInfo.roles
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
      const parent = menusObj.value[i.parentId!]
      if (parent) {
        parent.children!.push(i)
        return false
      }
      return true
    })
    initDynamicRouter()
  }

  // 获取菜单id的层级数组
  function getMenuLevelArr(id: number) {
    const arr: Menu[] = []
    let currentMenu = menusObj.value[id]
    while (currentMenu) {
      arr.unshift(currentMenu)
      currentMenu = menusObj.value[currentMenu.parentId!]
    }
    return arr
  }

  // 初始化动态路由
  function initDynamicRouter() {
    const viewsComponent = import.meta.glob('@/views/**/*.vue')
    router.addRoute({
      name: layoutRouteName,
      path: `/${layoutRouteName}`,
      component: () => import('@/layout/index.vue')
    })
    menus.value.forEach((i) => {
      // 路由路径
      const path = getMenuLevelArr(i.id)
        .map((i) => i.path)
        .join('/')
      // 路由全路径
      const fullPath = `/${layoutRouteName}/${path}`
      i.fullPath = fullPath
      if (i.type === 'menu' && ['route', 'iframe'].includes(i.handleType)) {
        // 路由名称
        const name = getMenuLevelArr(i.id)
          .map((i) => i.name)
          .join('/')
        // 组件name
        const componentName = camelCase(fullPath)
        const dynamicRoute: any = {
          name,
          path,
          fullPath,
          component: async () => {
            const component = viewsComponent[i.component]
            if (!component) throw new Error(`${i.component} 文件不存在！`)
            return component().then((comp: any) => ({
              ...comp.default,
              name: componentName
            }))
          },
          meta: {
            title: i.title,
            cache: i.cache,
            component: i.component,
            icon: i.icon,
            componentName,
            handleType: i.handleType,
            outerUrl: i.outerUrl
          }
        }
        // iframe 类型菜单需要缓存时，需将链接地址传入 props
        if (i.handleType === 'iframe' && i.cache) {
          dynamicRoute.props = { src: i.outerUrl }
        }
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
      if (!menu) return
      if (menu.type === 'menu') return menu
      if (menu.children?.length) {
        arr.unshift(...menu.children)
      }
    }
  }

  // 通过fullPath移除navTab
  function removeNavTabByFullPath(fullPath: string) {
    const index = navTabs.value.findIndex((i) => i.fullPath === fullPath)
    return removeNavTabByIndex(index)
  }

  // 通过index移除navTab
  function removeNavTabByIndex(index: number) {
    const currentMenu = navTabs.value[index]
    navTabs.value.splice(index, 1)
    // 如果删除了当前激活的路由，则需要自动跳转到右边的tab
    if (currentMenu.fullPath === route.fullPath) {
      // 如果是最右边路由，则需要左移一位
      if (index > navTabs.value.length - 1) index--
      return router.push(navTabs.value[index].fullPath)
    }
  }

  // 切换角色
  async function switchRole(orgRole: OrgRole) {
    return switchUserRole(orgRole, {
      showSuccessMsg: true
    }).then(() => {
      setTimeout(() => globalThis.location.reload(), 1000)
    })
  }

  // 注销
  function logout() {
    globalThis.location.reload()
  }

  // 菜单选中时
  function onMenuSelect(menu: Menu) {
    if (menu.handleType === 'outer') {
      globalThis.open(menu.outerUrl)
    } else router.push(menu.fullPath)
  }

  return {
    layout,
    locale,
    token,
    user,
    treeMenus,
    menus,
    menusObj,
    orgRoles,
    navTabs,
    activeMenuArr,
    keepAliveComponentNameList,
    getFirstRoute,
    beforeEach,
    afterEach,
    setToken,
    setLoginUserInfo,
    removeNavTabByIndex,
    removeNavTabByFullPath,
    switchRole,
    logout,
    refresh,
    setRefresh,
    setLocale,
    loginStatus,
    onMenuSelect
  }
})
