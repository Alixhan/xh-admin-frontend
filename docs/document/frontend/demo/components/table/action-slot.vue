<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px">
    <template #left-action>
      <el-button type="primary" icon="plus"> 新增 </el-button>
      <el-button type="primary" icon="download"> 导入 </el-button>
    </template>
    <template #right-action>
      <el-button type="danger" icon="delete"> 删除 </el-button>
    </template>
  </m-table>
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

for (let i = 0; i < 6; i++) {
  data.value.push({
    title: '标题' + i,
    remark: '备注' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
