<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="handleType === 'detail' ? 12 : 24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-if="['gaimi'].includes(handleType)"
        icon="key"
        type="primary"
        :loading="saveLoading"
        @click="save('gaimi')"
      >
        执行改密
      </el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['gaimi:account:add', 'gaimi:account:edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save('save')"
      >
        {{ $t('common.save') }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import { getGaimiAccountById, postSaveGaimiAccount } from '@/api/gaimi/account'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String as PropType<FormHandleType>,
    default: 'add'
  },
  modelValue: {
    type: Object as PropType<{ id: number }>
  }
})

const { t } = useI18n()

const emit = defineEmits(['close', 'gaimi'])

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  enabled: true,
  password: ''
})

if (props.handleType !== 'add') {
  // 查询明细
  formLoading.value = true
  Promise.all([getGaimiAccountById(props.modelValue!.id!)]).then(([a]) => {
    formData.value = a.data
    formLoading.value = false
  })
}

// 表单列定义
const columns = ref<FormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'username', label: '账号', rules: { required: true } },
    {
      prop: 'password',
      label: '密码',
      autocomplete: 'new-password',
      rules: { required: true }
    },
    { prop: 'remark', label: '备注', maxlength: 100 },
    { prop: 'newpassword', label: '新密码', hidden: props.handleType !== 'gaimi' }
  ]
})

// 保存方法
function save(type: string) {
  formRef.value.submit().then(() => {
    if (type === 'gaimi') {
      close()
      return emit('gaimi', formData.value)
    }
    postSaveGaimiAccount(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }).then(() => {
      close('refresh')
    })
  })
}

function close(type?: any) {
  emit('close', type)
}
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }
}
</style>
