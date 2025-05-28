<template>
  <div class="el-text">
    <el-radio-group v-model="status">
      <el-radio value="success" label="模拟导入成功" />
      <el-radio value="error" label="模拟后端导入失败" />
    </el-radio-group>
    <m-excel-import :columns="excelColumns" :on-complete="complete" style="height: 400px" />
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'
import { ElNotification } from 'element-plus'

const status = ref('success')

const excelColumns = computed(() => [
  { prop: 'code', label: '登录账号', rules: [{ required: true }], note: '字母和数字组合' },
  { prop: 'name', label: '用户名', rules: [{ required: true }] },
  { prop: 'telephone', label: '手机号', rules: [{ type: 'phone' }] },
  { prop: 'birthday', label: '生日', rules: [{ required: true, dateFormat: 'YYYY-MM-DD' }], note: '日期格式' },
  { prop: 'password', label: '密码', rules: [{ required: true }] }
])

// 开始导入数据
async function complete(data) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (status.value === 'error') {
    return [{ rowIndex: 0, error: '该用户已经存在了！' }]
  }
  ElNotification({
    type: 'success',
    message: `导入成功了 ${data.length} 条数据`
  })
}
</script>
<style lang="scss" scoped></style>
