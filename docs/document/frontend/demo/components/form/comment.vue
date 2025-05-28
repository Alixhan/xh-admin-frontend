<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData" />
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup lang="tsx">
import { createVNode, ref } from 'vue'
import { CommonFormColumn } from '@i/components/form'

const formRef = ref()

const columns = ref<CommonFormColumn<typeof formData.value>>([
  {
    prop: 'name',
    label: '昵称',
    comment: '填一个好听的名字'
  },
  {
    prop: 'num',
    type: 'input-number',
    step: 0.1,
    label: '数值',
    comment: createVNode('span', { style: { color: 'red' } }, '输入数值型')
  },
  {
    prop: 'phoneNum',
    label: '手机号',
    comment: <div style="color: green;">输入标准的手机号</div>
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
