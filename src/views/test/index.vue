<template>
  <div>
    <el-button @click="add">添加数据</el-button>
    <el-input v-model="num" />
    <el-switch v-model="tag" />
    <el-table :data="data">
      <el-table-column type="index" label="序" />
      <el-table-column label="序">
        <template v-slot="scope">
          <el-select v-model="scope.row.a">
            <el-option label="123" value="1" />
            <el-option label="jhgfd" value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-for="i in 4" :key="i" label="测试列" prop="b">
        <template v-slot="scope">
          <el-input v-model="scope.row.b" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from 'vue'


const data = ref<any []>([])
const num = ref(2)
const formData = reactive({
  a: 'fsdfsdf',
  b: '所经历的副科级塑料袋封口吉林科技'
})

add()

const tag = ref(true)

function add() {
  for (let i = 0; i < num.value; i++) {
    data.value.push({ ...formData })
  }
}
</script>
<style lang="scss" scoped></style>
