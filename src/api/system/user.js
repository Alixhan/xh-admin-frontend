import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 系统登录
 */
export function userLogin(params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/login`, params)
}

/**
 * 系统注销
 */
export function userLogout(option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/logout`)
}
