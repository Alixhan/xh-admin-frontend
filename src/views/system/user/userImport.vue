<template>
  <el-dialog
    title="用户导入"
    v-model="visible2"
    align-center
    draggable
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    width="80%"
  >
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
import { importUsers } from '@/api/system/user'

const visible2 = ref(false)

const excelColumns = ref([
  { prop: 'code', label: '用户账号', rules: [{ required: true }] },
  { prop: 'name', label: '用户名', rules: [{ required: true }] },
  { prop: 'telephone', label: '手机号码', rules: [{ type: 'phone' }], note: '11位手机号码' },
  { prop: 'password', label: '初始密码', rules: [{ required: true }] },
])

// 开始导入数据
function complete(data, callback) {
  importUsers(data)
    .then((res) => {
      callback(res.data)
    })
    .catch((e) => {
      callback([{ error: e.message ?? '导入失败' }])
    })
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
