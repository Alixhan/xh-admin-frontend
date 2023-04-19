<template>
  <div>
    <el-button @click="add">添加数据</el-button>
    <el-input v-model="num" />
    <el-table :data="data">
      <el-table-column fixed type="index" label="序"/>
      <el-table-column label="序">
        <template v-slot="scope">
          <el-select v-model="scope.row.b">
            <el-option label="123" value="1" />
            <el-option label="jhgfd" value="2" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column v-for="i in 10" :key="i" show-overflow-tooltip label="测试列" prop="b" />
    </el-table>
  </div>
</template>
<script setup lang="jsx">

import { reactive, ref } from 'vue'
import { useSystemStore } from '@/store/system'

const data = ref([])
const num = ref(1)
const formData = reactive({
  a: 'fsdfsdf',
  b: '所经历的副科级塑料袋封口吉林科技',
})

function add () {
  for (let i = 0; i < num.value; i++) {
    data.value.push({ ...formData })
  }
}

const systemStore = useSystemStore()

</script>
<style lang="scss" scoped>
</style>
