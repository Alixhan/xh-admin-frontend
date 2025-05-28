<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="200px" :pagination="pagination" />
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const tableColumns = ref([
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'remark', label: '备注' },
  { prop: 'expirationDate', label: '截止日期' }
])

const pagination = {
  pageSize: 500,
  background: false,
  pageSizes: [12, 24, 500, 10000],
  layout: 'jumper,prev,pager,next,sizes',
  defaultPageSize: 12,
  nextIcon: 'CaretRight'
}

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
