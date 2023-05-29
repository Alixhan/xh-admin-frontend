import axios from 'axios'

/**
 * 获取文件源代码，请求后会被缓存提高用户体验，避免重复请求浪费网络资源
 * sunxh 2022-7-10
 */
const fileBinaryMap = new Map()

function readFileBinary(src) {
  let fileBinary = fileBinaryMap.get(src)
  if (fileBinary) {
    if (fileBinary.binary) return Promise.resolve(fileBinary.binary)
    if (fileBinary.fetch) return fileBinary.fetch
  }
  fileBinary = {
    fetch: axios(src)
      .then((res) => {
        const binary = res.data
        fileBinary.binary = binary
        return binary
      })
      .catch(() => {
        delete fileBinary.fetch
      })
  }
  fileBinaryMap.set(src, fileBinary)
  return fileBinary.fetch
}

export default readFileBinary

export { fileBinaryMap, readFileBinary }
