import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 机构列表查询
export function queryOrgTree(params = {}) {
  return createAxios().get(`${systemBaseUrl}/api/system/org/tree`, { params })
}

// 机构列表查询
export function queryOrgList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/org/query`, params)
}

// 保存系统机构
export function postSaveOrg(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/org/save`, params)
}

// 获取机构详情
export function getOrgById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/org/get/${id}`)
}

// 批量删除机构
export function delOrgByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/org/del`, { params: { ids } })
}
