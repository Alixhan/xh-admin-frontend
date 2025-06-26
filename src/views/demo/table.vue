<template>
  <div class="root">
    <el-button @click="add">添加</el-button>
    <el-input v-model="num" />
    <m-table class="fff" selection="single" :columns="columns" :data="data" layout="auto" :height="200" />
    <el-table :data="data" height="400px" border stripe fit highlight-current-row style="width: 100%" row-key="fd">
      <el-table-column prop="fd" label="字段1">
        <template #default="scope">
          <el-input v-model="scope.row.fd" />
        </template>
      </el-table-column>
      <el-table-column prop="fd2" label="字段2">
        <template #default="scope">
          <el-input v-model="scope.row.gh" />
        </template>
      </el-table-column>
      <el-table-column prop="fd2" label="字段2">
        <template #default="scope">
          <el-input v-model="scope.row.fd2" />
        </template>
      </el-table-column>
      <el-table-column v-for="j in num2" :key="j" :prop="`prop${j}`" :label="`字段${j}`">
        <template #default="scope">
          <el-input v-model="scope.row[`prop${j}`]" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-link type="danger" icon="delete" @click="data.splice(scope.$index, 1)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
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
  { type: 'operation' },
  { label: '字段1', prop: 'fd' },
  {
    label: '字段3',
    children: [
      { label: '字段ss', prop: 'fd223' },
      { label: '字段fs1', prop: 'fd2211收拾收拾懂法守法2' }
    ]
  },
  {
    label: '字段2',
    prop: 'fd2',
    prop2: 'fd22',
    type: 'daterange',
    editable: true,
    required: true,
    editParam: {
      single: true
    }
  }
])

const data = ref([{ fd: '房东', fd2: '2023-11-08', fd22: '2023-11-09' }])
const num = ref(1)
const num2 = ref(30)

function add() {
  for (let i = 0; i < num.value; i++) {
    const obj = {}
    for (let j = 0; j < num2.value; j++) {
      obj['prop' + j] = `字段${i} -- ${j}`
    }
    data.value.push({ fd: '房东' + data.value.length, fd2: '2023-11-08', fd22: '2023-11-09', ...obj })
  }
}
</script>
<style lang="scss" scoped>
.root {
  background: var(--el-bg-color);

  .fff {
    padding: 20px;
  }
}
</style>
