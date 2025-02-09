import createAxios from '@/utils/request'
import type { AxiosProgressEvent } from 'axios'

const fileBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 文件上传
 */
export function uploadFile(file: File, onUploadProgress: (event: AxiosProgressEvent) => void = () => {}) {
  const formData = new FormData()
  formData.append('file', file)
  return createAxios().post(`${fileBaseUrl}/api/file/operation/upload`, formData, {
    headers: {
      'Content-type': 'multipart/form-data'
    },
    onUploadProgress
  })
}

// 文件列表查询
export function queryFileList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${fileBaseUrl}/api/file/operation/query`, params)
}

// 保存系统文件
export function postSaveFile(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${fileBaseUrl}/api/file/operation/save`, params)
}

// 获取文件详情
export function getFileById(id: number) {
  return createAxios().get(`${fileBaseUrl}/api/file/operation/get/${id}`)
}

// 批量删除文件
export function delFileByIds(ids: string, option?: RequestOption) {
  return createAxios(option).delete(`${fileBaseUrl}/api/file/operation/del`, { params: { ids } })
}
