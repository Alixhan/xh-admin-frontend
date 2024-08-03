import axios from 'axios'

export const fileBinaryMap: Map<string, Promise<string>> = new Map()

/**
 * 获取文件源代码，请求后会被缓存提高用户体验，避免重复请求浪费网络资源
 * @author 2022-7-10 sunxh
 */
export default async function fetchBinary(src: string) {
  let fileBinary = fileBinaryMap.get(src)
  if (!fileBinary) {
    if (!src) return ''
    fileBinary = axios(src)
      .then((res) => res.data)
      .catch(() => {
        delete fileBinaryMap[src]
        return Promise.reject()
      })
    fileBinaryMap.set(src, fileBinary)
  }
  return fileBinary
}
