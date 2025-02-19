<template>
  <div class="form-view">
    <m-form ref="formRef" :colspan="24" :columns="columns" :model="formData" :loading="formLoading" />
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-auth="['system:user:resetPassword']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ $t('common.save') }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import { postRestPassword } from '@/api/system/user'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Object as PropType<{ id: number; code: string; name: string }>,
    required: true
  }
})

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'close', type: 'refresh' | string): void
}>()

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  id: 0,
  code: '',
  name: '',
  password: ''
})

formData.value.id = props.modelValue.id
formData.value.code = props.modelValue.code
formData.value.name = props.modelValue.name
formData.value.password = ''
formLoading.value = false

// 表单列定义
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'code', label: t('system.user.code'), readonly: true },
    { prop: 'name', label: t('system.user.name'), readonly: true },
    {
      prop: 'password',
      label: t('system.user.newPassword'),
      rules: { required: true }
    }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    postRestPassword(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }).then(() => close('refresh'))
  })
}

function close(type?: any) {
  emit('close', type)
}
</script>
<style lang="scss" scoped></style>
