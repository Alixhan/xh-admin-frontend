<template>
  <!--  page  -->
  <div class="card">
    <div ref="chart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import { useEcharts } from '@/utils/echarts'
import { ref } from 'vue'

const option = ref({
  title: {
    text: '南丁格尔玫瑰图',
    subtext: '表头提示文本',
    left: 'center'
  },
  // 鼠标移入显示的东西
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    left: 'center',
    top: 'bottom',
    data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      // 点击小图标数据详情的显示与隐藏
      dataView: { show: true, readOnly: false },
      // 刷新图表按键的显示与隐藏
      restore: { show: true },
      // 保存图表按键的显示与隐藏
      saveAsImage: { show: true }
    }
  },
  series: {
    // 修改这个字段可以显示不同类型的图，其中数据等得相应修改
    type: 'sankey', // 图表类型为桑基图
    layout: 'none',
    emphasis: {
      focus: 'adjacency'
    },
    data: [{ name: 'a' }, { name: 'b' }, { name: 'a1' }, { name: 'a2' }, { name: 'b1' }, { name: 'c' }],
    links: [
      { source: 'a', target: 'a1', value: 5 },
      { source: 'a', target: 'a2', value: 3 },
      { source: 'b', target: 'b1', value: 8 },
      { source: 'a', target: 'b1', value: 3 },
      { source: 'b1', target: 'a1', value: 1 },
      { source: 'b1', target: 'c', value: 2 }
    ]
  }
})

const { domRef: chart } = useEcharts(option)
</script>
