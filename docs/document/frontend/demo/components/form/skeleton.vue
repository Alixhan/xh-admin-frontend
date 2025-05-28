<template>
  <div class="el-text demo-view">
    <div>
      加载中：
      <el-switch v-model="loading" />
    </div>
    <m-form ref="formRef" :loading="loading" :columns="columns" :model="formData" />
    <el-button class="btn" type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'

const formRef = ref()

const columns = ref([
  {
    prop: 'nickName',
    label: '昵称',
    rules: [{ required: true }]
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
    rules: [{ required: true }]
  },
  {
    prop: 'file',
    label: '风景图',
    type: 'upload-img',
    cols: 3,
    limit: 5
  }
])

const loading = ref(true)

const formData = ref({})

async function submit() {
  const data = await formRef.value.submit()
  console.log(data)
}
</script>
<style lang="scss" scoped>
.demo-view {
  display: flex;
  flex-direction: column;

  .btn {
    align-self: end;
  }
}
</style>
