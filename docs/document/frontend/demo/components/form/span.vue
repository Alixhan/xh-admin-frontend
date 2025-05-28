<template>
  <div class="demo-view">
    <m-form ref="formRef" :colspan="6" :columns="columns" :model="formData" />
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const formRef = ref()

const columns = ref([
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称', colspan: 24 },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称', cols: 2 },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称', cols: 3 },
  { prop: 'name', label: '昵称' },
  { prop: 'name', label: '昵称' }
])

const formData = ref({})

async function submit() {
  const data = await formRef.value.submit()
  console.log(data)
}
</script>
<style lang="scss" scoped>
.demo-view {
  text-align: end;
}
</style>
