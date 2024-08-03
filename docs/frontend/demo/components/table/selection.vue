<template>
  <m-table
    :columns="tableColumns"
    v-model:data="data"
    height="200"
    selection="single"
    @selection-change="(rows) => (selectRows1 = rows)"
  />
  <br/>
  <m-table
    :columns="tableColumns"
    v-model:data="data"
    height="200"
    selection="multiple"
    :selection-limit="7"
    @selection-change="(rows) => (selectRows2 = rows)"
  />
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import MTable from '@/components/table/index.vue'

const tableColumns = ref([
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', width: 100 },
  { prop: 'remark', label: '备注' },
  { prop: 'expirationDate', label: '截止日期' }
])

const data = ref([])

const selectRows1 = ref([])
const selectRows2 = ref([])

for (let i = 0; i < 54; i++) {
  data.value.push({
    title: '标题' + i,
    remark: '备注' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
