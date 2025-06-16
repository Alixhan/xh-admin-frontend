<template>
  <m-excel-import
    embedded
    :columns="excelColumns"
    :on-complete="complete"
    download-template-button-name="下载测试模板"
    select-file-button-name="批量导入"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'
import { ElNotification } from 'element-plus'

const excelColumns = computed(() => [
  { prop: 'code', label: '登录账号', rules: [{ required: true }], note: '字母和数字组合' },
  { prop: 'name', label: '用户名', rules: [{ required: true }] },
  { prop: 'telephone', label: '手机号', rules: [{ type: 'phone' }] },
  { prop: 'birthday', label: '生日', rules: [{ required: true, dateFormat: 'YYYY-MM-DD' }], note: '日期格式' },
  { prop: 'password', label: '密码', rules: [{ required: true }] }
])

// 开始导入数据
async function complete(data) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  ElNotification({
    type: 'success',
    message: `导入成功了 ${data.length} 条数据`
  })
}
</script>
<style lang="scss" scoped></style>
