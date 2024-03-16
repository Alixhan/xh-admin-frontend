/**
 * 国际化 2023-11-5
 * sxh
 */
import { createI18n } from 'vue-i18n'
import { useSystemStore } from '@/stores/system'
import { merge } from 'lodash-es'

// ele语言包
import elZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import elZhTw from 'element-plus/dist/locale/zh-tw.mjs'
import elEn from 'element-plus/dist/locale/en.mjs'
import elJa from 'element-plus/dist/locale/ja.mjs'

//本地语言包
import zhCn from './locale/zh-cn'
import zhTw from './locale/zh-tw'
import en from './locale/en'
import ja from './locale/ja'

import Chinese from '@/assets/icon/chinese.svg'
import ChineseF from '@/assets/icon/chinesef.svg'
import English from '@/assets/icon/english.svg'
import Japanese from '@/assets/icon/japanese.svg'
import { useLocalStorage } from '@vueuse/core'

export declare type LocaleKey = 'zh-cn' | 'zh-tw' | 'en' | 'ja'

export class Locales {
  key: LocaleKey
  //语言名称
  label: string
  //字符预制宽度 像素,只是平均的大致宽度
  charWidth: number[]
  //语言包数据
  locale: object
  //语言图标
  icon: string

  constructor(key: LocaleKey, label: string, charWidth: number[], locale: object, icon: string) {
    this.key = key
    this.label = label
    this.charWidth = charWidth
    this.locale = locale
    this.icon = icon
  }

  /**
   * 获取当前字符平均宽度，注意只是平均宽度，随当前字体大小调整
   */
  getCharWidth(): number {
    const charWidth = this.charWidth
    let width: number
    const systemStore = useSystemStore()
    if (systemStore.layout.size === 'small') width = charWidth[0]
    if (systemStore.layout.size === 'default') width = charWidth[1]
    if (systemStore.layout.size === 'large') width = charWidth[2]
    return width!
  }
}

export const locales: Locales[] = [
  new Locales('zh-cn', '简体中文', [10, 13, 15], merge(zhCn, elZhCn), Chinese),
  new Locales('zh-tw', '繁體中文', [10, 13, 15], merge(zhTw, elZhTw), ChineseF),
  new Locales('en', 'English', [6, 7.2, 8.5], merge(en, elEn), English),
  new Locales('ja', '日本語', [10.3, 13, 15], merge(ja, elJa), Japanese)
]

export function getLocale() {
  return locales.reduce((obj, i) => {
    obj[i.key] = i.locale
    return obj
  }, {})
}

/**
 * 获取当前国际化配置
 */
export function getCurrentLocales(): Locales {
  const systemStore = useSystemStore()
  return locales.find((i) => i.key === systemStore.locale)!
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: useLocalStorage<LocaleKey>('locale', 'zh-cn').value,
  fallbackLocale: 'zh-cn',
  messages: getLocale()
})

export default i18n
