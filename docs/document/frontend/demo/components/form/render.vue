<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData" />
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const formRef = ref()

const columns = ref([
  {
    prop: 'hobby',
    label: '爱好',
    type: 'select',
    itemList: [
      { value: 1, label: '游泳' },
      { value: 2, label: '撸铁' }
    ],
    rules: [{ required: true }],
    render: (vNode) => {
      return ['随便选就行', vNode]
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
