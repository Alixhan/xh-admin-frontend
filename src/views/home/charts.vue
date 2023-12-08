<template>
  <div v-for="(domRef, i) in echartsDomRefs" :key="i" :ref="r => domRef.value = r as any" class="charts-item"/>
</template>
<script lang="ts" setup>
import type {EChartsOption} from '@/utils'
import {useEcharts} from '@/utils'
import type {Ref} from 'vue'
import {nextTick, reactive, ref, toRef, watch} from 'vue'
import {useCssVar} from '@vueuse/core'
import {useThemeStore} from '@/stores/theme'


const color = ref({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [{
    offset: 0, color: useCssVar('--el-color-primary-light-7').value // 0% 处的颜色
  }, {
    offset: 1, color: useCssVar('--el-color-primary').value // 100% 处的颜色
  }],
})

const optionArr: EChartsOption[] = [
  {
    title: {
      text: '环形图',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0',
      left: 'center'
    },
    series: [
      {
        top: '-5%',
        name: '爱好',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'var(--layout-bg-color)',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [
          {value: 735, name: '唱'},
          {value: 580, name: '跳'},
          {value: 484, name: 'rap'},
          {value: 300, name: '篮球'}
        ]
      }
    ]
  },
  {
    color: color.value,
    title: {
      text: '折线图',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        symbolSize: 10,
        smooth: true,
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
    ]
  },
  {
    color: color.value,
    title: {
      text: '柱状图',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      }
    ]
  },
  {
    color: color.value,
    title: {
      text: '仪表盘',
      textStyle: {
        fontSize: 14
      }
    },
    textStyle: {
      fontFamily: 'Microsoft YaHei',
      fontSize: 18,
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '85%',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
        },
        data: [
          {
            value: 50,
            name: '完成率'
          },
        ]
      }
    ]
  }
]
const echartsDomRefs: Ref<HTMLElement | undefined> [] = optionArr.map((option) => useEcharts(toRef(option)).domRef)

const themeStore = useThemeStore()
watch(
    () => themeStore.currentTheme,
    () => nextTick(() => {
      color.value.colorStops[0].color = useCssVar('--el-color-primary-light-7').value
      color.value.colorStops[1].color = useCssVar('--el-color-primary').value
    })
)
</script>
<style lang="scss" scoped>
.charts-item {
  height: 230px;
}
</style>
