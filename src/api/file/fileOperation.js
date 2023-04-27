import createAxios from '@/utils/request'

const fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL

/**
 * 文件上传
 */
export function uploadFile (file = {}, onUploadProgress = () => {}) {
  const formData = new FormData()
  formData.append('file', file)
  return createAxios().post(`${fileBaseUrl}/api/file/operation/upload`, formData, {
    headers: {
      'Content-type': 'multipart/form-data'
    },
    onUploadProgress
  })
}
