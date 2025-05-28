<template>
  <div class="card">
    <div ref="chartRef" style="width: 100%; height: 400px"></div>

    <el-button @click="getDataUrl" type="primary">导出图片</el-button>
    <img :src="src" width="100%" alt="" />
  </div>
</template>

<script setup lang="ts">
import { useEcharts } from '@/utils/echarts'
import { ref } from 'vue'
import { type ECharts } from 'echarts'

const option = ref({
  angleAxis: {},
  radiusAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu'],
    z: 10
  },
  polar: {},
  series: [
    {
      type: 'bar',
      data: [1, 2, 3, 4],
      coordinateSystem: 'polar',
      name: 'A',
      stack: 'a',
      emphasis: {
        focus: 'series'
      }
    },
    {
      type: 'bar',
      data: [2, 4, 6, 8],
      coordinateSystem: 'polar',
      name: 'B',
      stack: 'a',
      emphasis: {
        focus: 'series'
      }
    },
    {
      type: 'bar',
      data: [1, 2, 3, 4],
      coordinateSystem: 'polar',
      name: 'C',
      stack: 'a',
      emphasis: {
        focus: 'series'
      }
    }
  ],
  legend: {
    show: true,
    data: ['A', 'B', 'C']
  }
})

const { domRef: chartRef } = useEcharts(option, onInit)
let instance: ECharts

// 初始化后的回调，携带图表实例参数
function onInit(echartsInstance: ECharts) {
  instance = echartsInstance
}

const src = ref()

function getDataUrl() {
  src.value = instance.getDataURL()
}
</script>
