<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData" />
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'

const formRef = ref()

const columns = ref([
  {
    prop: 'nickName',
    label: '昵称',
    rules: [{ required: true, trigger: 'blur' }],
    slots: {
      append: () => <el-button type="primary">查询</el-button>
    }
  },
  {
    prop: 'hobby',
    label: '爱好',
    type: 'select',
    itemList: [
      { value: 1, label: '游泳' },
      { value: 2, label: '撸铁' },
      { value: 3, label: '打游戏' }
    ],
    rules: [{ required: true }],
    slots: {
      label({ label, value }) {
        return [<span>{label}: </span>, <span style="font-weight: bold">{value}</span>]
      }
    }
  }
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
