import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 系统登录
 */
export function userLogin(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/login`, params)
}

/**
 * 系统注销
 */
export function userLogout(option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/logout`)
}

// 菜单列表查询
export function queryUserList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/query`, params)
}

// 切换菜单字段值
export function postSwitchUserProp(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/switch_prop`, params)
}

// 保存系统菜单
export function postSaveUser(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/save`, params)
}

// 获取菜单详情
export function getUserById(id) {
  return createAxios().get(`${systemBaseUrl}/api/system/user/get/${id}`)
}

// 批量删除菜单
export function delUserByIds(ids, option: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/user/del/${ids}`)
}
