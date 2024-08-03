<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px" />
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const tableColumns = ref([
  { type: 'index', align: 'center', fixed: 'left' },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'remark', label: '备注' },
  { prop: 'expirationDate', label: '截止日期', align: 'center', fixed: 'right' }
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
