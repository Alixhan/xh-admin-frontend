<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" :is-page="false" />
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

const data = ref([])

for (let i = 0; i < 12; i++) {
  data.value.push({
    title: '标题' + i,
    remark: '备注' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
