<template>
  <m-table ref="tableRef" :columns="tableColumns" v-model:data="data" height="300">
    <template #left-action>
      <el-button type="primary" @click="doValid"> 表格数据验证</el-button>
    </template>
  </m-table>
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'

const tableColumns = [
  { type: 'index', align: 'center' },
  {
    prop: 'phoneNum',
    label: '手机号',
    editable: true,
    editParam: { size: 'small', rules: { required: true, type: 'phone' } }
  },
  {
    prop: 'expirationDate1',
    prop2: 'expirationDate2',
    label: '截止日期',
    editable: true,
    editParam: { size: 'small', type: 'daterange', single: true }
  }
]

const data = ref([])

for (let i = 0; i < 7; i++) {
  data.value.push({
    phoneNum: 13800138008 + i,
    remark: '备注' + i,
    expirationDate1: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}

const tableRef = ref()

async function doValid() {
  await tableRef.value.validate()
  ElNotification.success('验证成功')
}
</script>
<style lang="scss" scoped></style>
