<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData" />
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import MForm from '@/components/form/index.vue'

const formRef = ref()

const columns = ref([
  {
    prop: 'date-picker-panel',
    label: '日期选择器面板',
    type: 'date-picker-panel',
    cols: 2,
    $param: {
      type: 'datetime'
    }
  }
])

const formData = ref({})
</script>
<style lang="scss" scoped>
</style>
