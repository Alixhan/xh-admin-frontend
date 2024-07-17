<template>
  <div class="root">
    <el-card>
      <m-form
        ref="formRef"
        :loading="formLoading"
        :columns="columns"
        :model="formData"
        handleType="edit"
        :colspan="24"
      ></m-form>
      <div class="m-footer">
        <el-button icon="check" type="primary" :loading="saveLoading" @click="save">{{ $t('common.save') }}</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="tsx" setup>
import { useSystemStore } from '@/stores/system'
import { computed, ref } from 'vue'
import { getPersonalCenterDetail, personalCenterSave } from '@/api/system/user'
import { useI18n } from 'vue-i18n'
import type { CommonFormColumn } from '@i/components/form'

defineOptions({
  name: 'PersonalCenter'
})

const { t } = useI18n()

const systemStore = useSystemStore()

const formData = ref({
  password: '',
  password2: ''
})

const columns = computed<CommonFormColumn<typeof formData.value>[]>(() => [
  { prop: 'code', label: t('system.user.code'), disabled: true },
  { prop: 'name', label: t('system.user.name') },
  { prop: 'avatar', label: t('system.user.avatar'), type: 'upload-img', single: 'object' },
  { prop: 'telephone', label: t('system.user.telephone'), rules: { type: 'phone' } },
  {
    prop: 'password',
    label: t('system.user.newPassword'),
    type: 'password',
    autocomplete: 'new-password',
    placeholder: t('system.user.newPasswordH')
  },
  {
    prop: 'password2',
    label: t('system.user.repeatPassword'),
    placeholder: t('system.user.repeatPassword'),
    type: 'password',
    rules: [
      {
        validator: (rule, val, callback) => {
          if (formData.value.password && formData.value.password !== val) {
            return callback(new Error(t('system.user.passwordMismatches')))
          }
          callback()
        }
      }
    ]
  }
])

const formLoading = ref(true)
const saveLoading = ref(false)
const formRef = ref()
getPersonalCenterDetail().then((res) => {
  formData.value = res.data
  formData.value.password = ''
  formLoading.value = false
})

function save() {
  formRef.value.submit().then(() => {
    personalCenterSave(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }).then((res) => {
      systemStore.user.avatar = res.data.avatar
    })
  })
}
</script>
<style lang="scss" scoped></style>
