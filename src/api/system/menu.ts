import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 菜单列表查询
export function queryMenuList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/query`, params)
}

// 切换菜单字段值
export function postSwitchMenuProp(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/switch_prop`, params)
}

// 保存系统菜单
export function postSaveMenu(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/menu/save`, params)
}

// 获取菜单详情
export function getMenuById(id) {
  return createAxios().get(`${systemBaseUrl}/api/system/menu/get/${id}`)
}

// 批量删除菜单
export function delMenuByIds(ids, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/menu/del/${ids}`)
}
