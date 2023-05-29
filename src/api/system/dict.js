import createAxios from '@/utils/request'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

// 数据字典列表查询
export function queryDictTypeList(params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/type/query`, params)
}

// 数据字典明细列表查询
export function queryDictDetailList(params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/detail/query`, params)
}

// 保存系统数据字典明细
export function postSaveDictDetail(params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/detail/save`, params)
}

// 获取数据字典明细详情
export function getDictDetailById(id) {
  return createAxios().get(`${systemBaseUrl}/api/system/dict/detail/get/${id}`)
}

// 切换数据字典字段值
export function postSwitchDictProp(params = {}, option) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/dict/switch-dict-prop`, params)
}
