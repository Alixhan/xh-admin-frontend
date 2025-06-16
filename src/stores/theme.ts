import { defineStore } from 'pinia'
import { useCssVar, useLocalStorage } from '@vueuse/core'
import { useSystemStore } from '@/stores/system'
import type { Ref } from 'vue'
import { computed, ref, toRef, watchEffect } from 'vue'

export interface ThemeObj {
  id: string
  label: string
  primary?: '#409eff'
  theme?: Theme
}

export interface Theme {
  [cssVar: string]: { light: string; dark: string }
}

/**
 * 主题管理
 * sxh 2023-09-17
 */
export const useThemeStore = defineStore('theme', () => {
  const defaultTheme: Theme = {
    '--el-color-white': { light: '#ffffff', dark: '#ececec' },
    '--el-color-black': { light: '#02191c', dark: '#1c1c1c' },

    '--el-bg-color-page': { light: '#f5f5f5', dark: '#2b2b2b' },
    '--el-bg-color': { light: '#ffffff', dark: '#232323' },
    '--el-bg-color-overlay': { light: '#ffffff', dark: '#1d1e1f' },

    '--el-color-primary': { light: '#409eff', dark: '#409eff' },
    '--el-color-primary-light-3': { light: '#79bbff', dark: '#3375b9' },
    '--el-color-primary-light-5': { light: '#a0cfff', dark: '#2a598a' },
    '--el-color-primary-light-7': { light: '#c6e2ff', dark: '#213d5b' },
    '--el-color-primary-light-8': { light: '#d9ecff', dark: '#1d3043' },
    '--el-color-primary-light-9': { light: '#ecf5ff', dark: '#18222c' },
    '--el-color-primary-dark-2': { light: '#337ecc', dark: '#66b1ff' }
    // '--el-fill-color': { light: '#f0f2f5', dark: '#303030' },
    // '--el-fill-color-light': { light: '#f5f7fa', dark: '#262727' },
    // '--el-fill-color-lighter': { light: '#fafafa', dark: '#1D1D1D' },
    // '--el-fill-color-extra-light': { light: '#fafcff', dark: '#191919' },
    // '--el-fill-color-dark': { light: '#ebedf0', dark: '#39393A' },
    // '--el-fill-color-darker': { light: '#e6e8eb', dark: '#424243' },
    // '--el-fill-color-blank': { light: '#ffffff', dark: 'transparent' },
    // '--el-color-success': { light: '#67c23a', dark: '#67c23a' },
    // '--el-color-success-light-3': { light: '#95d475', dark: '#4e8e2f' },
    // '--el-color-success-light-5': { light: '#b3e19d', dark: '#3e6b27' },
    // '--el-color-success-light-7': { light: '#d1edc4', dark: '#2d481f' },
    // '--el-color-success-light-8': { light: '#e1f3d8', dark: '#25371c' },
    // '--el-color-success-light-9': { light: '#f0f9eb', dark: '#1c2518' },
    // '--el-color-success-dark-2': { light: '#529b2e', dark: '#85ce61' },
    // '--el-color-warning': { light: '#e6a23c', dark: '#e6a23c' },
    // '--el-color-warning-light-3': { light: '#eebe77', dark: '#a77730' },
    // '--el-color-warning-light-5': { light: '#f3d19e', dark: '#7d5b28' },
    // '--el-color-warning-light-7': { light: '#f8e3c5', dark: '#533f20' },
    // '--el-color-warning-light-8': { light: '#faecd8', dark: '#3e301c' },
    // '--el-color-warning-light-9': { light: '#fdf6ec', dark: '#292218' },
    // '--el-color-warning-dark-2': { light: '#b88230', dark: '#ebb563' },
    // '--el-color-danger': { light: '#f56c6c', dark: '#f56c6c' },
    // '--el-color-danger-light-3': { light: '#f89898', dark: '#b25252' },
    // '--el-color-danger-light-5': { light: '#fab6b6', dark: '#854040' },
    // '--el-color-danger-light-7': { light: '#fcd3d3', dark: '#582e2e' },
    // '--el-color-danger-light-8': { light: '#fde2e2', dark: '#412626' },
    // '--el-color-danger-light-9': { light: '#fef0f0', dark: '#2b1d1d' },
    // '--el-color-danger-dark-2': { light: '#c45656', dark: '#f78989' },
    // '--el-color-error': { light: '#f56c6c', dark: '#f56c6c' },
    // '--el-color-error-light-3': { light: '#f89898', dark: '#b25252' },
    // '--el-color-error-light-5': { light: '#fab6b6', dark: '#854040' },
    // '--el-color-error-light-7': { light: '#fcd3d3', dark: '#582e2e' },
    // '--el-color-error-light-8': { light: '#fde2e2', dark: '#412626' },
    // '--el-color-error-light-9': { light: '#fef0f0', dark: '#2b1d1d' },
    // '--el-color-error-dark-2': { light: '#c45656', dark: '#f78989' },
    // '--el-color-info:': { light: '#909399', dark: '#909399' },
    // '--el-color-info-light-3': { light: '#b1b3b8', dark: '#6b6d71' },
    // '--el-color-info-light-5': { light: '#c8c9cc', dark: '#525457' },
    // '--el-color-info-light-7': { light: '#dedfe0', dark: '#393a3c' },
    // '--el-color-info-light-8': { light: '#e9e9eb', dark: '#2d2d2f' },
    // '--el-color-info-light-9': { light: '#f4f4f5', dark: '#202121' },
    // '--el-color-info-dark-2': { light: '#73767a', dark: '#a6a9ad' },
    // '--el-text-color-primary': { light: '#303133', dark: '#E5EAF3' },
    // '--el-text-color-regular': { light: '#606266', dark: '#CFD3DC' },
    // '--el-text-color-secondary': { light: '#909399', dark: '#A3A6AD' },
    // '--el-text-color-placeholder': { light: '#a8abb2', dark: '#8D9095' },
    // '--el-text-color-disabled': { light: '#c0c4cc', dark: '#6C6E72' },
    // '--el-border-color': { light: '#dcdfe6', dark: '#4C4D4F' },
    // '--el-border-color-light': { light: '#e4e7ed', dark: '#414243' },
    // '--el-border-color-lighter': { light: '#ebeef5', dark: '#363637' },
    // '--el-border-color-extra-light': { light: '#f2f6fc', dark: '#2B2B2C' },
    // '--el-border-color-dark': { light: '#d4d7de', dark: '#58585B' },
    // '--el-border-color-darker': { light: '#cdd0d6', dark: '#636466' },
    // '--el-mask-color': { light: 'rgba(255, 255, 255, 0.9)', dark: 'rgba(0, 0, 0, 0.8)' },
    // '--el-mask-color-extra-light': { light: 'rgba(255, 255, 255, 0.3)', dark: 'rgba(0, 0, 0, 0.3)' },
    // '--el-box-shadow': { light: '0px 12px 32px 4px rgba(0, 0, 0, 0.04),0px 8px 20px rgba(0, 0, 0, 0.08)', dark: '' },
    // '--el-box-shadow-light': { light: '0px 0px 12px rgba(0, 0, 0, 0.12)', dark: '' },
    // '--el-box-shadow-lighter': { light: '0px 0px 6px rgba(0, 0, 0, 0.12)', dark: '' },
    // '--el-box-shadow-dark': {
    //   light:
    //     '0px 16px 48px 16px rgba(0, 0, 0, 0.08),0px 12px 32px rgba(0, 0, 0, 0.12),0px 8px 16px -8px rgba(0, 0, 0, 0.16)',
    //   dark: '',
    // },
    // '--el-disabled-bg-color': { light: 'var(--el-fill-color-light)', dark: '' },
    // '--el-disabled-text-color': { light: 'var(--el-text-color-placeholder)', dark: '' },
    // '--el-disabled-border-color': { light: 'var(--el-border-color-light)', dark: '' },
    // '--el-overlay-color': { light: 'rgba(0, 0, 0, 0.8)', dark: '' },
    // '--el-overlay-color-light': { light: 'rgba(0, 0, 0, 0.7)', dark: '' },
    // '--el-overlay-color-lighter': { light: 'rgba(0, 0, 0, 0.5)', dark: '' },
    // '--el-border-width': { light: '1px', dark: '' },
    // '--el-border-style': { light: 'solid', dark: '' },
    // '--el-border-color-hover': { light: 'var(--el-text-color-disabled)', dark: '' },
    // '--el-border': { light: 'var(--el-border-width) var(--el-border-style) var(--el-border-color)', dark: '' },
    // '--el-svg-monochrome-grey': { light: 'var(--el-border-color)', dark: '' },
  }

  const themeList: Ref<ThemeObj[]> = ref([
    {
      id: 'default',
      label: '默认',
      primary: '#409eff'
    },
    {
      id: '石板',
      label: '石板',
      theme: {
        '--el-color-primary-dark-2': { light: '#475569', dark: '#768aa5' },
        '--el-color-primary': { light: '#5D6F89', dark: '#798BA4' },
        '--el-color-primary-light-3': { light: '#798BA4', dark: '#677B98' },
        '--el-color-primary-light-5': { light: '#9BA8BB', dark: '#596A83' },
        '--el-color-primary-light-7': { light: '#BCC5D2', dark: '#4C5B70' },
        '--el-color-primary-light-8': { light: '#DEE2E8', dark: '#404D5E' },
        '--el-color-primary-light-9': { light: '#F0F2F5', dark: '#343E4C' }
      }
    },
    {
      id: '红',
      label: '红',
      theme: {
        '--el-color-primary-dark-2': { light: '#b54545', dark: '#DC2626' },
        '--el-color-primary': { light: '#dc2626', dark: '#e65050' },
        '--el-color-primary-light-3': { light: '#ef4444', dark: '#B81E1E' },
        '--el-color-primary-light-5': { light: '#f87171', dark: '#9E1A1A' },
        '--el-color-primary-light-7': { light: '#fca5a5', dark: '#881616' },
        '--el-color-primary-light-8': { light: '#fecaca', dark: '#611010' },
        '--el-color-primary-light-9': { light: '#fee2e2', dark: '#2e2121' }
      }
    },
    {
      id: '橙',
      label: '橙',
      theme: {
        '--el-color-primary-dark-2': { light: '#E56306', dark: '#FBA365' },
        '--el-color-primary': { light: '#F97316', dark: '#FA8633' },
        '--el-color-primary-light-3': { light: '#FB9E5B', dark: '#F46906' },
        '--el-color-primary-light-5': { light: '#FCBE92', dark: '#bd835e' },
        '--el-color-primary-light-7': { light: '#FDD6B9', dark: '#8B3C03' },
        '--el-color-primary-light-8': { light: '#FEEADC', dark: '#5A2702' },
        '--el-color-primary-light-9': { light: '#FFF6F0', dark: '#33281f' }
      }
    },
    {
      id: '琥珀',
      label: '琥珀',
      theme: {
        '--el-color-primary-dark-2': { light: '#DC8F09', dark: '#F59E0B' },
        '--el-color-primary': { light: '#F59E0B', dark: '#D38909' },
        '--el-color-primary-light-3': { light: '#F8B84A', dark: '#B07207' },
        '--el-color-primary-light-5': { light: '#FACD80', dark: '#8E5C06' },
        '--el-color-primary-light-7': { light: '#FCE2B6', dark: '#6C4604' },
        '--el-color-primary-light-8': { light: '#FEF2DD', dark: '#452C03' },
        '--el-color-primary-light-9': { light: '#FEF7EB', dark: '#302d24' }
      }
    },
    {
      id: '碧绿',
      label: '碧绿',
      theme: {
        '--el-color-primary-dark-2': { light: '#68A111', dark: '#84CC16' },
        '--el-color-primary': { light: '#84CC16', dark: '#79BD14' },
        '--el-color-primary-light-3': { light: '#9FE930', dark: '#6EAA12' },
        '--el-color-primary-light-5': { light: '#B8EF67', dark: '#5F9310' },
        '--el-color-primary-light-7': { light: '#D0F49A', dark: '#507C0D' },
        '--el-color-primary-light-8': { light: '#E7FACC', dark: '#385709' },
        '--el-color-primary-light-9': { light: '#F2FCE3', dark: '#294007' }
      }
    },
    {
      id: '绿',
      label: '绿',
      theme: {
        '--el-color-primary-dark-2': { light: '#147538', dark: '#22C55E' },
        '--el-color-primary': { light: '#1B9D4B', dark: '#1FB757' },
        '--el-color-primary-light-3': { light: '#22C55E', dark: '#1CA54F' },
        '--el-color-primary-light-5': { light: '#40DE7A', dark: '#199044' },
        '--el-color-primary-light-7': { light: '#6FE69B', dark: '#157A3A' },
        '--el-color-primary-light-8': { light: '#9FEFBC', dark: '#0F5729' },
        '--el-color-primary-light-9': { light: '#CFF7DE', dark: '#1d2720' }
      }
    },
    {
      id: '绿宝石',
      label: '绿宝石',
      theme: {
        '--el-color-primary-dark-2': { light: '#047652', dark: '#059669' },
        '--el-color-primary': { light: '#059669', dark: '#058A60' },
        '--el-color-primary-light-3': { light: '#07D997', dark: '#047B56' },
        '--el-color-primary-light-5': { light: '#30F8B9', dark: '#046D4B' },
        '--el-color-primary-light-7': { light: '#75FAD0', dark: '#035E41' },
        '--el-color-primary-light-8': { light: '#BAFDE8', dark: '#02402D' },
        '--el-color-primary-light-9': { light: '#DCFEF3', dark: '#222c28' }
      }
    },
    {
      id: '水鸭',
      label: '水鸭',
      theme: {
        '--el-color-primary-dark-2': { light: '#0A756C', dark: '#0D9488' },
        '--el-color-primary': { light: '#0D9488', dark: '#0C887E' },
        '--el-color-primary-light-3': { light: '#12D3C3', dark: '#0B7A71' },
        '--el-color-primary-light-5': { light: '#3FEEE0', dark: '#096C64' },
        '--el-color-primary-light-7': { light: '#80F4EA', dark: '#085952' },
        '--el-color-primary-light-8': { light: '#BDF9F4', dark: '#06423D' },
        '--el-color-primary-light-9': { light: '#DEFCFA', dark: '#042A27' }
      }
    },
    {
      id: '青色',
      label: '青色',
      theme: {
        '--el-color-primary-dark-2': { light: '#0590A9', dark: '#06B6D4' },
        '--el-color-primary': { light: '#06B6D4', dark: '#06A9C6' },
        '--el-color-primary-light-3': { light: '#1BD7F9', dark: '#0599B3' },
        '--el-color-primary-light-5': { light: '#56E2FA', dark: '#04839A' },
        '--el-color-primary-light-7': { light: '#8DEBFC', dark: '#046E81' },
        '--el-color-primary-light-8': { light: '#C8F6FD', dark: '#034C59' },
        '--el-color-primary-light-9': { light: '#E1FAFE', dark: '#023740' }
      }
    },
    {
      id: '天空',
      label: '天空',
      theme: {
        '--el-color-primary-dark-2': { light: '#0B84BC', dark: '#0EA5E9' },
        '--el-color-primary': { light: '#0EA5E9', dark: '#0D98D9' },
        '--el-color-primary-light-3': { light: '#3AB8F3', dark: '#0C8BC5' },
        '--el-color-primary-light-5': { light: '#6ACAF6', dark: '#0A76A8' },
        '--el-color-primary-light-7': { light: '#9ADBF9', dark: '#08628C' },
        '--el-color-primary-light-8': { light: '#CFEEFC', dark: '#064460' },
        '--el-color-primary-light-9': { light: '#E7F6FE', dark: '#043348' }
      }
    },
    {
      id: '靛',
      label: '靛',
      theme: {
        '--el-color-primary-dark-2': { light: '#2326EB', dark: '#A7A7C3' },
        '--el-color-primary': { light: '#6366F1', dark: '#6d6dba' },
        '--el-color-primary-light-3': { light: '#8183F4', dark: '#8888AF' },
        '--el-color-primary-light-5': { light: '#A1A3F7', dark: '#7979A5' },
        '--el-color-primary-light-7': { light: '#C2C3FA', dark: '#60608F' },
        '--el-color-primary-light-8': { light: '#DEDFFC', dark: '#424262' },
        '--el-color-primary-light-9': { light: '#F1F1FE', dark: '#2b2b35' }
      }
    },
    {
      id: '紫',
      label: '紫',
      theme: {
        '--el-color-primary-dark-2': { light: '#7F4CF5', dark: '#a786ff' },
        '--el-color-primary': { light: '#8B5CF6', dark: '#997ee1' },
        '--el-color-primary-light-3': { light: '#AF90F9', dark: '#8b5df8' },
        '--el-color-primary-light-5': { light: '#C8B2FB', dark: '#9165f5' },
        '--el-color-primary-light-7': { light: '#DCCFFC', dark: '#7f51fa' },
        '--el-color-primary-light-8': { light: '#EEE7FE', dark: '#402f6a' },
        '--el-color-primary-light-9': { light: '#F8F5FE', dark: '#212028' }
      }
    },
    {
      id: '粉红',
      label: '粉红',
      theme: {
        '--el-color-primary-dark-2': { light: '#C5216B', dark: '#E878AA' },
        '--el-color-primary': { light: '#DB2777', dark: '#DB2777' },
        '--el-color-primary-light-3': { light: '#E878AA', dark: '#B81F63' },
        '--el-color-primary-light-5': { light: '#F0A8C8', dark: '#951951' },
        '--el-color-primary-light-7': { light: '#F6CBDE', dark: '#6D123B' },
        '--el-color-primary-light-8': { light: '#FBE9F1', dark: '#4A0C28' },
        '--el-color-primary-light-9': { light: '#FDF2F7', dark: '#292021' }
      }
    },
    {
      id: '玫瑰红',
      label: '玫瑰红',
      theme: {
        '--el-color-primary-dark-2': { light: '#F92A49', dark: '#FB7185' },
        '--el-color-primary': { light: '#FB7185', dark: '#F93956' },
        '--el-color-primary-light-3': { light: '#FC8D9E', dark: '#EE0729' },
        '--el-color-primary-light-5': { light: '#FDABB7', dark: '#B3051F' },
        '--el-color-primary-light-7': { light: '#FDC8D0', dark: '#770315' },
        '--el-color-primary-light-8': { light: '#FEE1E6', dark: '#3C020A' },
        '--el-color-primary-light-9': { light: '#FFF0F2', dark: '#2b2323' }
      }
    }
  ])

  //当前主题id
  const currentTheme = useLocalStorage('currentTheme', 'default')

  const theme = computed(() => {
    return {
      ...defaultTheme,
      ...themeList.value.find((i) => i.id === currentTheme.value)?.theme
    }
  })

  // 菜单的主题
  const menuTheme = computed(() => {
    const systemStore = useSystemStore()
    const isDark = toRef(systemStore.layout, 'isDark')
    const menuInvertColor = toRef(systemStore.layout, 'menuInvertColor')
    let t = isDark.value ? 'dark' : 'light'
    if (menuInvertColor.value) {
      t = t === 'dark' ? 'light' : 'dark'
    }
    return t
  })

  //监听主题和明暗，动态调整主题颜色
  watchEffect(switchTheme)

  //更换主题
  function changeThemeId(themeId?: string) {
    if (themeId) currentTheme.value = themeId
  }

  //动态调整主题颜色
  function switchTheme() {
    const systemStore = useSystemStore()
    const isDark = toRef(systemStore.layout, 'isDark')
    for (const key in theme.value) {
      useCssVar(key, document.documentElement).value = theme.value[key]?.[isDark.value ? 'dark' : 'light']
    }
    switchMenuTheme()
  }

  //调整菜单的颜色
  function switchMenuTheme() {
    useCssVar('--el-menu-active-color', document.documentElement).value =
      theme.value['--el-color-primary'][menuTheme.value]
    useCssVar('--el-menu-text-color', document.documentElement).value =
      menuTheme.value === 'dark' ? '#dddddd' : '#505050'
    useCssVar('--el-menu-bg-color', document.documentElement).value = theme.value['--el-bg-color'][menuTheme.value]
    useCssVar('--el-menu-hover-bg-color', document.documentElement).value =
      theme.value['--el-color-primary-light-8'][menuTheme.value]
    useCssVar('--el-menu-active-bg-color', document.documentElement).value =
      theme.value['--el-color-primary-light-9'][menuTheme.value]
  }

  return {
    themeList,
    currentTheme,
    changeThemeId,
    theme,
    menuTheme
  }
})
