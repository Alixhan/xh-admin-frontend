<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px" />
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import dayjs from 'dayjs'

const tableColumns = ref([
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', width: 100 },
  {
    prop: 'remark',
    label: '备注',
    slots: {
      default: ({ row }) => <span style="color: red;">{row.remark}</span>
    }
  },
  {
    prop: 'expirationDate',
    sortable: false,
    slots: {
      header: ({ column }) => (
        <el-button type="primary" size="small">
          我是定义的{column.property}
        </el-button>
      )
    }
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
