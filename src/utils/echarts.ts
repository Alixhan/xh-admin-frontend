import * as echarts from 'echarts/core'
import {
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components'
import { BarChart, GaugeChart, LineChart, PieChart, SankeyChart, ScatterChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'
import type { Ref } from 'vue'
import { effectScope, onMounted, onScopeDispose, ref, watch } from 'vue'
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  GridComponentOption,
  LegendComponentOption,
  LineSeriesOption,
  PieSeriesOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts'
import { useSystemStore } from '@/stores/system'
import { useDebounceFn, useElementSize } from '@vueuse/core'

echarts.use([
  BarChart,
  TooltipComponent,
  LegendComponent,
  PieChart,
  SVGRenderer,
  LabelLayout,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  UniversalTransition,
  GaugeChart,
  SankeyChart,
  ScatterChart,
  PolarComponent
])

export type EChartsOption = echarts.ComposeOption<
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
  | BarSeriesOption
  | TitleComponentOption
  | ToolboxComponentOption
  | GridComponentOption
  | LineSeriesOption
  | GaugeSeriesOption
>

export function useEcharts(option: Ref<EChartsOption>, onInit?: (eChart: echarts.ECharts) => void) {
  const domRef = ref<HTMLElement>()
  const { width, height } = useElementSize(domRef)
  let echartsInstance: echarts.ECharts
  const systemStore = useSystemStore()

  async function initEcharts() {
    if (!domRef.value || !width.value) return
    echartsInstance?.dispose()
    const theme = systemStore.layout.isDark ? 'dark' : 'default'
    echartsInstance = echarts.init(domRef.value, theme)
    onInit?.(echartsInstance)
    await setOption()
  }

  async function setOption(opt?: EChartsOption, notMerge?: any, lazyUpdate?: any) {
    if (!echartsInstance) await initEcharts()
    ;(opt ?? option.value).backgroundColor ??= 'transparent'
    echartsInstance?.setOption(opt ?? option.value, notMerge, lazyUpdate)
  }

  let initialized = false

  const scope = effectScope()
  scope.run(() => {
    watch(
      () => option.value,
      (opt) => setOption(opt, true),
      { deep: true }
    )

    watch(
      () => [width.value, height.value],
      useDebounceFn(async () => {
        if (!echartsInstance) await initEcharts()
        if (initialized && width.value) echartsInstance?.resize()
        else initialized = true
      }, 40)
    )

    //监听主题切换
    watch(
      () => systemStore.layout.isDark,
      (isDark) => {
        echartsInstance?.setTheme(isDark ? 'dark' : 'default')
      }
    )
  })

  onMounted(initEcharts)

  onScopeDispose(() => {
    echartsInstance?.dispose()
    scope.stop()
  })
  return { domRef, setOption }
}
