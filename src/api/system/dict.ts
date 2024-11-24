import createAxios from '@/utils/request'
import type { PageQuery } from '@i/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 数据字典列表查询
export function queryDictTypeList(params: PageQuery<any>, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/type/query`, params)
}

// 数据字典明细列表查询
export function queryDictDetailList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/detail/query`, params)
}

// 保存系统数据字典明细
export function postSaveDictDetail(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/detail/save`, params)
}

// 获取数据字典明细详情
export function getDictDetailById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/dict/detail/get/${id}`)
}

// 批量删除数据字典明细
export function delDictDetailByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/dict/detail/del`, { params: { ids } })
}
