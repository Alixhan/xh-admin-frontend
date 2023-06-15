<template>
  <el-dialog title="用户导入" v-model="visible2" align-center draggable destroy-on-close
             append-to-body :close-on-click-modal="false" width="80%">
    <m-excel-import :columns="excelColumns" :on-complete="complete" style="height: 75vh">
      <template #tip>
        <div style="color: red">用户登录账户名不能重复</div>
      </template>
    </m-excel-import>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'

const visible2 = ref(false)

const excelColumns = ref([
  {
    prop: 'code',
    label: '用户账号',
    rules: [{ required: true }],
  },
  {
    prop: 'name',
    label: '用户名',
    rules: [{ required: true }],
  },
])

// 导入的
function complete(data, callback) {
  console.info(data)
  setTimeout(() => {
    // callback()
    callback([{ num: 1, excelNum: 2, error: '失败了啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊' }])
  }, 3000)
}

// 打开导入框
function open() {
  visible2.value = true
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped></style>
