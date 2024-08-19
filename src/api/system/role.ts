import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 角色列表查询
export function queryRoleList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/role/query`, params)
}

// 保存系统角色
export function postSaveRole(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/role/save`, params)
}

// 获取角色详情
export function getRoleById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/role/get/${id}`)
}

// 批量删除角色
export function delRoleByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/role/del`, { params: { ids } })
}

// 查询角色可配置的所有权限菜单
export function queryRoleMenu(params = {}, option?: RequestOption) {
  return createAxios(option).get(`${systemBaseUrl}/api/system/role/queryRoleMenu`, { params })
}

// 查询角色的数据权限
export function queryRoleDataPermission(params = {}, option?: RequestOption) {
  return createAxios(option).get(`${systemBaseUrl}/api/system/role/queryRoleDataPermission`, { params })
}

// 保存角色数据权限
export function saveRoleDataPermission(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/role/saveRoleDataPermission`, params)
}
