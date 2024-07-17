import axios from 'axios'
import { type Ref, ref, watchEffect } from 'vue'


export const fileBinaryMap: Map<string, Promise<string>> = new Map()

/**
 * 获取文件源代码，请求后会被缓存提高用户体验，避免重复请求浪费网络资源
 * @author 2022-7-10 sunxh
 */
export default function useFileBinary(src: Ref<string>) {
  const binary = ref<string>()
  watchEffect(() => {
    let fileBinary = fileBinaryMap.get(src.value)
    if (!fileBinary) {
      fileBinary = axios(src.value)
        .then((res) => res.data)
        .catch(() => delete fileBinaryMap[src.value])
      fileBinaryMap.set(src.value, fileBinary)
    }
    fileBinary.then((data) => (binary.value = data))
  })
  return binary
}
