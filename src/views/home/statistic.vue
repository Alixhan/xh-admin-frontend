<template>
  <div class="statistic-view">
    <div v-for="(statistic, i) in statisticArr" :key="i" :style="`background: ${statistic.color}`">
      <div>
        <el-icon size="25">
          <m-icon :model-value="statistic.icon" />
        </el-icon>
        <div>{{ statistic.label }}</div>
      </div>
      <div :ref="(countRef) => (statistic.ref.value = countRef)">{{ statistic.count }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useCountUp } from '@/utils'
import { ref, toRef } from 'vue'

defineOptions({
  name: 'HomeStatistic'
})
const statisticArr: any[] = [
  {
    label: '总销量',
    icon: 'el|ElementPlus',
    color: 'linear-gradient(120deg, rgba(78,175,178,0.6), rgba(78,175,178,0.8))',
    count: ref(65433)
  },
  {
    label: '总客户',
    icon: 'el|User',
    color: 'linear-gradient(120deg, rgba(182,78,139,0.6), rgba(182,78,139,0.8))',
    count: ref(34555)
  },
  {
    label: '销售额',
    icon: 'el|Coin',
    color: 'linear-gradient(120deg, rgba(215,131,105,0.6), rgba(215,131,105,0.8))',
    count: ref(775663.75),
    option: { prefix: '￥' }
  },
  {
    label: '订单数',
    icon: 'el|Postcard',
    color: 'linear-gradient(120deg, rgba(211,179,73,0.6), rgba(211,179,73,0.8))',
    count: ref(75543)
  }
]
statisticArr.forEach((i) => (i.ref = useCountUp(toRef(i.count), i.option)))
</script>
<style lang="scss" scoped>
.statistic-view {
  display: grid;
  gap: 10px;

  > div {
    color: white;
    font-size: 14px;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background: gray;

    > div:first-child {
      > :first-child {
        padding-bottom: 10px;
      }
    }

    > div:last-child {
      font-size: 2em;
      font-weight: bold;
    }
  }
}
</style>
