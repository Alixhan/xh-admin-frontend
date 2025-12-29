<template>
  <div class="root">
    <el-input v-model="num" />
    {{ data }}
    <m-table
      class="fff"
      selection="multiple"
      :columns="columns"
      :data="data"
      layout="auto"
      @selection-change="(rows) => (selectRows = rows)"
    >
    </m-table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { CommonTableColumn } from '@i/components/table'

defineOptions({
  name: 'DemoTable'
})
const columns = ref<CommonTableColumn<any>[]>([
  { type: 'index' },
  { type: 'operation', fixed: 'right', buttons: [{ label: '添加' }] },
  { label: '字段1', prop: 'fd', editable: true },
  {
    label: '字段3',
    prop: 'sf',
    children: [
      { label: 'aaaa', prop: 'task.a', editable: true },
      {
        label: '级联属性',
        prop: 'task.b',
        editable: true,
        // type: 'select',
        itemList: [
          { value: '123', label: '123migncheng' },
          { value: 'fff', label: '123migncheng' }
        ]
      },
      { label: 'ccc', prop: 'task.c', editable: true, editParam: { type: 'switch' } },
      { label: '字段ss123', prop: 'p2', editable: true },
      { label: '字段ss123', prop: 'p2', editable: true },
      { label: '字段ss123', prop: 'p2', editable: true },
      { label: '字段ss123', prop: 'p2', editable: true },
      { label: '字段ss123', prop: 'p2', editable: true }
    ]
  },
  {
    label: '字段21',
    prop: 'fd2',
    prop2: 'fd22',
    type: 'daterange',
    width: 300,
    editable: true,
    required: true,
    editParam: {
      single: true
    }
  }
])

const data = ref([
  {
    fd: '房东',
    fd2: '2023-11-08',
    fd22: '2023-11-09',
    task: {
      a: 'sff',
      b: '123'
    }
  }
])
const num = ref(10)
const selectRows = ref([])
</script>
<style lang="scss" scoped>
.root {
  background: var(--el-bg-color);

  .fff {
    padding: 20px;
  }
}
</style>
