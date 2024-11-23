import createAxios from '@/utils/request'

const generatorBaseUrl = import.meta.env.VITE_GENERATOR_BASE_URL

// 代码生成列表查询
export function queryGeneratorList(params: PageQuery, option?: RequestOption) {
  return createAxios(option).post(`${generatorBaseUrl}/api/generator/query`, params)
}

// 保存系统代码生成
export function postSaveGenerator(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${generatorBaseUrl}/api/generator/save`, params)
}

// 获取代码生成详情
export function getGeneratorById(id: number) {
  return createAxios().get(`${generatorBaseUrl}/api/generator/get/${id}`)
}

// 获取后端java项目开发环境的绝对路径
export function getBackendPath() {
  return createAxios().get(`${generatorBaseUrl}/api/generator/getBackendPath`)
}

// 获取数据库表列表
export function getTableList(option?: RequestOption) {
  return createAxios(option).get(`${generatorBaseUrl}/api/generator/getTableList`)
}

// 获取表详情
export function getTableDetail(params = {}, option?: RequestOption) {
  return createAxios(option).get(`${generatorBaseUrl}/api/generator/getTableDetail`, { params })
}

// 批量删除代码生成
export function delGeneratorByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${generatorBaseUrl}/api/generator/del`, { params: { ids } })
}

// 生成代码
export function postGenerateCode(id: number, option?: RequestOption) {
  return createAxios(option).post(`${generatorBaseUrl}/api/generator/generate/${id}`)
}

// 下载代码zip
export function getCodeZipFile(id: number, option?: RequestOption) {
  return createAxios(option).get(`${generatorBaseUrl}/api/generator/getCodeZipFile/${id}`, { responseType: 'blob' })
}
