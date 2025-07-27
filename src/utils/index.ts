import { computed, effectScope, onScopeDispose } from 'vue'
import { useSystemStore } from '@/stores/system'
import type { DownloadParam } from '@i/utils'

export * from './countup'
export * from './dict'
export * from './echarts'
export * from './excel'
export * from './loading'
export * from './request'
export * from './validate'
export * from './string'

/**
 * 获取文件下载url
 * @param param
 * @returns string
 */
export function getDownloadFileUrl(param: DownloadParam): string {
  if (!param) return ''
  if (!param.id && !param.object) return ''
  let fileBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL
  if (!fileBaseUrl.startsWith('http')) fileBaseUrl = import.meta.env.VITE_BASE_URL + fileBaseUrl
  const systemStore = useSystemStore()
  return Object.keys(param).reduce(
    (url, key) => {
      if (!param[key]) return url
      return `${url}&${key}=${encodeURIComponent(param[key])}`
    },
    `${fileBaseUrl}/api/file/operation/download?${import.meta.env.VITE_SYS_TOKEN_KEY}=${systemStore.token}`
  )
}

/**
 * 获取当前elementComponent的css变量
 */
export function useElComponentSizeCssVar() {
  const systemStore = useSystemStore()
  const scope = effectScope()
  const state = scope.run(() => {
    return computed(() => {
      let str = '--el-component-size'
      if (['small', 'large'].includes(systemStore.layout.size)) {
        str += '-' + systemStore.layout.size
      }
      return `var(${str})`
    })
  })
  onScopeDispose(() => scope.stop())
  return state!
}

/**
 * 获取当前设备操作系统
 */
export function getOS() {
  const userAgent = navigator.userAgent
  if (/Windows/.test(userAgent)) return 'windows'
  if (/Android/.test(userAgent)) return 'android'
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'ios'
  if (/Mac OS X/.test(userAgent)) return 'macos'
  if (/Linux/.test(userAgent)) return 'linux'
  return 'unknow'
}
