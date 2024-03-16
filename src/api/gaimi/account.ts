import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 用户列表查询
export function queryGaimiAccountList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/gaimi/account/query`, params)
}

// 保存系统用户
export function postSaveGaimiAccount(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/gaimi/account/save`, params)
}

// 更新单个数据
export function postSwitchProp(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/gaimi/account/switch_prop`, params)
}

// 获取用户详情
export function getGaimiAccountById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/gaimi/account/get/${id}`)
}

// 批量删除用户
export function delGaimiAccountByIds(ids: string, option: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/gaimi/account/del`, { params: { ids } })
}
