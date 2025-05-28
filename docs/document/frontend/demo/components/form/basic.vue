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
  { prop: 'mc', label: '昵称', rules: [{ required: true }] },
  { prop: 'birthday', type: 'date', label: '生日' },
  { prop: 'phoneNum', label: '手机号码', rules: [{ required: true, type: 'phone' }] },
  { prop: 'remark', label: '备注', type: 'textarea', cols: 3, rules: [{ maxlength: 50 }] },
  {
    prop: 'radio-group',
    label: '单选组',
    type: 'radio-group',
    cols: 2,
    itemList: [
      { value: '1', label: '选项1' },
      { value: '2', label: '选项2' },
      { value: '3', label: '选项3' }
    ],
    rules: [{ required: true }]
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
