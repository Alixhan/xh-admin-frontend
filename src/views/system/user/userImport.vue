<template>
  <el-dialog
    :title="$t('system.user.imports')"
    v-model="visible"
    align-center
    draggable
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    width="80%"
  >
    <m-excel-import :columns="excelColumns" :on-complete="complete" style="height: 75vh" />
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'
import { importUsers } from '@/api/system/user'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

declare type CloseType = 'refresh' | undefined

const emits = defineEmits<{
  (e: 'close', type?: CloseType): void
}>()

const { t } = useI18n()

const visible = ref(false)

const excelColumns = computed(() => [
  { prop: 'code', label: t('system.user.code'), rules: [{ required: true }] },
  { prop: 'name', label: t('system.user.name'), rules: [{ required: true }] },
  {
    prop: 'telephone',
    label: t('system.user.telephone'),
    rules: [{ type: 'phone' }],
    note: t('system.user.telephoneNote')
  },
  { prop: 'password', label: t('system.user.password'), rules: [{ required: true }] }
])

// 开始导入数据
function complete(data, callback) {
  importUsers(data)
    .then((res) => {
      callback(res.data)
      if (!res.data) {
        ElNotification({
          type: 'success',
          message: t('common.importSuccess'),
          duration: 3000
        })
        close('refresh')
      }
    })
    .catch((e) => {
      callback([{ error: e.message ?? t('common.importsFailed') }])
    })
}

// 打开导入框
function open() {
  visible.value = true
}

// 关闭
function close(type?: CloseType) {
  visible.value = false
  type && emits('close', type)
}

defineExpose({
  open
})
</script>
<style lang="scss" scoped></style>
