<template>
  <div class="el-text demo-view">
    <el-input class="item1" placeholder="手机号" v-model="val" />
    <el-button class="item1" @click="doValid" type="primary">验证</el-button>
    验证结果：{{ JSON.stringify(result) }}
  </div>
</template>
<script setup>
import { fieldValid } from '@/utils/validate'
import { ref } from 'vue'

const val = ref()
const rules = [{ required: true }, { type: 'phone' }]

const result = ref()

async function doValid() {
  result.value = await fieldValid(
    {
      prop: 'name',
      label: '手机号',
      rules
    },
    val.value
  )
}
</script>
<style scoped>
.demo-view {
  display: flex;
  flex-direction: column;
  gap: 10px;

  > .item1 {
    max-width: 400px;
  }
}
</style>
