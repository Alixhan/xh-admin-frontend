import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 菜单列表查询
export function queryMenuList (params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/query`, params)
}

// 切换菜单字段值
export function postSwitchMenuProp (params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/switch_menu_prop`, params)
}

// 保存系统菜单
export function postSaveMenu (params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/save`, params)
}

// 获取菜单详情
export function getMenuById (id) {
  return createAxios().get(`${systemBaseUrl}/api/system/menu/get/${id}`)
}
