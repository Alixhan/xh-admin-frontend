import { useSystemStore } from '@/stores/system'

/**
 * 获取文件下载url
 * @param param
 * @returns string
 */
export function getDownloadFileUrl(param: object): string {
  if (!param) return ''
  let fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL
  if (!fileBaseUrl.startsWith('http')) fileBaseUrl = import.meta.env.VITE_BASE_URL + fileBaseUrl
  const systemStore = useSystemStore()
  return Object.keys(param).reduce((url, key) => {
    return `${url}&${key}=${encodeURIComponent(param[key])}`
  }, `${fileBaseUrl}/api/file/operation/download?${import.meta.env.VITE_SYS_TOKEN_KEY}=${systemStore.token}`)
}

/**
 * 将数组每项中间插入分隔项
 * @param arr 原数组
 * @param item 插入的分隔项
 * @returns {*[]} 新数组
 */

export function join(arr: any[], item: any) {
  const arr2: any[] = []
  arr.forEach((i) => arr2.push(i, item))
  arr2.pop()
  return arr2
}
