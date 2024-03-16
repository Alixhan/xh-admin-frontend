import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 系统日志列表查询
export function queryLogList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/log/query`, params)
}

// 获取系统日志明细详情
export function getLogDetailById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/log/get/${id}`)
}

// 批量删除系统日志明细
export function delLogByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/log/del`, { params: { ids } })
}
