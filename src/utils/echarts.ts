import * as echarts from 'echarts/core'
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { BarChart, GaugeChart, LineChart, PieChart, SankeyChart } from 'echarts/charts'
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
  SankeyChart
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

export function useEcharts(option: Ref<EChartsOption>, onInit?: (echart: echarts.ECharts) => void) {
  option.value.backgroundColor ??= 'transparent'
  const domRef = ref<HTMLElement>()
  const { width, height } = useElementSize(domRef)
  let echartsInstance: echarts.ECharts
  const systemStore = useSystemStore()

  async function initEcharts() {
    if (!domRef.value) return
    echartsInstance?.dispose()
    const theme = systemStore.layout.isDark ? 'dark' : 'light'
    echartsInstance = echarts.init(domRef.value, theme)
    onInit?.(echartsInstance)
    setOption()
  }

  function setOption(opt?: EChartsOption) {
    echartsInstance?.setOption(opt ?? option.value)
  }

  const scope = effectScope()
  scope.run(() => {
    watch(
      () => option.value,
      (opt) => setOption(opt),
      { deep: true }
    )

    watch(
      () => [width.value, height.value],
      useDebounceFn(() => echartsInstance?.resize(), 40)
    )

    watch(() => [systemStore.layout.isDark], initEcharts)
  })

  onMounted(initEcharts)

  onScopeDispose(() => {
    echartsInstance?.dispose()
    scope.stop()
  })
  const rs = [domRef, setOption]
  rs['domRef'] = domRef
  rs['setOption'] = setOption
  return rs
}
