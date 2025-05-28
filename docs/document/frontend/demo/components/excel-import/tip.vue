<template>
  <m-excel-import :columns="excelColumns" :on-complete="complete" style="height: 300px">
    <template #tip>
      <el-text style="color: var(--el-color-danger)">这是上传的备注信息~</el-text>
    </template>
  </m-excel-import>
</template>
<script setup>
import { computed } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'

const excelColumns = computed(() => [
  { prop: 'code', label: '登录账号', rules: [{ required: true }], note: '字母和数字组合' },
  { prop: 'name', label: '用户名', rules: [{ required: true }] },
  { prop: 'telephone', label: '手机号', rules: [{ type: 'phone' }] }
])

// 开始导入数据
function complete(data) {
  console.info(data)
}
</script>
<style lang="scss" scoped></style>
