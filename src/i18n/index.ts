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

export interface Locales {
  key: LocaleKey,
  //语言名称
  label: string,
  //字符平均宽度 像素
  charWidth: number,
  //语言包数据
  locale: object,
  //语言图标
  icon: string,
}

export const locales: Locales [] = [
  { key: 'zh-cn', label: '简体中文',charWidth: 15, locale: merge(zhCn, elZhCn), icon: Chinese },
  { key: 'zh-tw', label: '繁體中文',charWidth: 15, locale: merge(zhTw, elZhTw), icon: ChineseF },
  { key: 'en', label: 'English',charWidth: 9, locale: merge(en, elEn), icon: English },
  { key: 'ja', label: '日本語',charWidth: 14, locale: merge(ja, elJa), icon: Japanese },
]

export function getLocale() {
  return locales.reduce((obj, i) => {
    obj[i.key] = i.locale
    return obj
  }, {})
}

/**
 * 获取当前单个字符的平均宽度，注意这只是字符平均宽度
 */
export function getCurrentLocales(): Locales {
  const systemStore = useSystemStore()
  return locales.find(i => i.key === systemStore.locale)!
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: useLocalStorage<LocaleKey>('locale', 'zh-cn').value,
  fallbackLocale: 'zh-cn',
  messages: getLocale()
})

export default i18n
