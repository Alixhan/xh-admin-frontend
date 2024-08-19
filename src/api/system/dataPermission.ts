import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 数据权限列表查询
export function queryDataEntityList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dataPermission/entity/query`, params)
}

// 数据权限列表查询
export function queryDataPermissionList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dataPermission/query`, params)
}

// 保存系统数据权限
export function postSaveDataPermission(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dataPermission/save`, params)
}

// 获取数据权限详情
export function getDataPermissionById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/dataPermission/get/${id}`)
}

// 批量删除数据权限
export function delDataPermissionByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/dataPermission/del`, { params: { ids } })
}
