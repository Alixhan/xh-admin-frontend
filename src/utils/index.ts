import {useSystemStore} from '@/stores/system'
import type {DownloadParam} from '@i/utils'

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
