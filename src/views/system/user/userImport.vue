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
import { importUsers } from '@/api/system/user'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { ImportExcelColumn } from '@i/utils/excel'

declare type CloseType = 'refresh' | undefined

const emits = defineEmits<{
  (e: 'close', type?: CloseType): void
}>()

const { t } = useI18n()

const visible = ref(false)

const excelColumns = computed<ImportExcelColumn[]>(() => [
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
async function complete(data: any[]) {
  return importUsers(data).then((res) => {
    if (!res.data) {
      ElNotification({
        type: 'success',
        message: t('common.importSuccess'),
        duration: 3000
      })
      close('refresh')
    }
    return res.data
  })
}

// 打开导入框
function open() {
  visible.value = true
}

// 关闭
function close(type?: CloseType) {
  visible.value = false
  if (type) emits('close', type)
}

defineExpose({
  open
})
</script>
<style lang="scss" scoped></style>
