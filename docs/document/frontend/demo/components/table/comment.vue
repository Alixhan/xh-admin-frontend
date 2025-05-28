<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px" />
</template>
<script setup lang="jsx">
import { h, ref } from 'vue'
import dayjs from 'dayjs'

const tableColumns = ref([
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', comment: '这个是一个标题呀', width: 100 },
  { prop: 'remark', label: '备注', comment: <span style="color: red;">这个是一个备注呀</span> },
  {
    prop: 'expirationDate',
    label: '截止日期',
    comment: h('span', { style: { color: 'green' } }, '我是截止日期备注说明')
  }
])

const data = ref([])

for (let i = 0; i < 54; i++) {
  data.value.push({
    title: '标题' + i,
    remark: '备注' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
