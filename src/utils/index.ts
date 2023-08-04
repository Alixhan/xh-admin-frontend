import { useSystemStore } from '@/stores/system'

export interface DownloadParam {
  //文件表ID
  id?: number | string
  //对象存储key
  object?: string
  //下载的文件名
  fileName?: string
  //文件MIME类型
  contentType?: string
  //告诉浏览器如何处理文件流，attachment为下载，inline浏览器在线预览，默认下载
  disposition?: 'attachment' | 'inline'
  //是否压缩显示缩略图
  isScale?: boolean
  //以最长边缩小到此大小等比例缩放,默认60像素
  scaleWidth?: number
}

/**
 * 获取文件下载url
 * @param param
 * @returns string
 */
export function getDownloadFileUrl(param: DownloadParam): string {
  if (!param) return ''
  let fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL
  if (!fileBaseUrl.startsWith('http')) fileBaseUrl = import.meta.env.VITE_BASE_URL + fileBaseUrl
  const systemStore = useSystemStore()
  return Object.keys(param).reduce((url, key) => {
    return `${url}&${key}=${encodeURIComponent(param[key])}`
  }, `${fileBaseUrl}/api/file/operation/download?${import.meta.env.VITE_SYS_TOKEN_KEY}=${systemStore.token}`)
}
