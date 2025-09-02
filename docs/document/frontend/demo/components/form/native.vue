<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData" />
  </div>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import { CommonFormColumn } from '@i/components/form'

const formRef = ref()

const columns = ref<CommonFormColumn<typeof formData.value>>([
  {
    prop: 'bobby',
    label: '爱好'
  },
  {
    type: 'div',
    prop: 'name',
    label: '昵称'
  },
  {
    type: 'blank',
    prop: 'name2',
    label: '展示为空'
  },
  {
    type: 'span',
    style: 'color: red',
    prop: 'phoneNum',
    label: '手机号'
  }
])

const formData = ref({
  name: '一颗小土豆',
  name2: '一颗小土豆2',
  phoneNum: '18543245664'
})
</script>
