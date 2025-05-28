<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px">
    <template #customSlot>
      <el-table-column label="slotName定制的列">
        <template #default="scope"> {{ scope.row.title }}--{{ scope.row.remark }} </template>
      </el-table-column>
    </template>
  </m-table>
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import MTable from '@/components/table/index.vue'

const tableColumns = ref([
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', width: 100 },
  { slotName: 'customSlot' },
  { prop: 'expirationDate', label: '截止日期' }
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
