<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll" max-height="70vh">
      <m-form
        ref="formRef"
        :colspan="handleType === 'detail' ? 12 : 24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      >
        <template #job>
          <jobs v-model="jobData" :handle-type="handleType" />
        </template>
        <template #group>
          <m-table :is-page="false" style="width: 100%" :columns="groupColumns" layout="auto" :data="groupData" />
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['system:user:add', 'system:user:edit']"
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
import { getUserById, getUserGroups, getUserJobs, postSaveUser } from '@/api/system/user'
import Jobs from '@/views/system/user/jobs.vue'
import { useI18n } from 'vue-i18n'
import { statusList } from '@/views/system/user/constant'

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

const emit = defineEmits<{
  //恢复默认
  (e: 'close', type: 'refresh' | string): void
}>()

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  allowRepeat: true,
  autoRenewal: false,
  enabled: true,
  password: ''
})

const jobData = ref([])
const groupData = ref([])

if (props.handleType !== 'add') {
  // 查询明细
  formLoading.value = true
  Promise.all([
    getUserById(props.modelValue!.id!),
    getUserJobs({
      type: 1,
      userId: props.modelValue!.id!
    }),
    getUserGroups(props.modelValue!.id)
  ]).then(([a, b, c]) => {
    formData.value = a.data
    formData.value.password = ''
    jobData.value = b.data
    groupData.value = c.data
    formLoading.value = false
  })
}

// 表单列定义
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'code',
      label: t('system.user.code'),
      rules: [{ required: true }, { pattern: /[a-zA-Z0-9]+/, message: t('system.user.userCodeRule') }]
    },
    { prop: 'name', label: t('system.user.name'), rules: { required: true } },
    { prop: 'avatar', label: t('system.user.avatar'), type: 'upload-img', single: 'object' },
    { prop: 'telephone', label: t('system.user.telephone'), rules: { type: 'phone' } },
    {
      prop: 'password',
      label: t('system.user.password'),
      autocomplete: 'new-password',
      hidden: props.handleType !== 'add'
    },
    {
      prop: 'allowRepeat',
      label: t('system.user.allowRepeat'),
      type: 'switch',
      comment: '开启后，账号可以重复登录，已登录的账号不会被挤下线。'
    },
    {
      prop: 'autoRenewal',
      label: t('system.user.autoRenewal'),
      type: 'switch',
      comment: '开启后，请求将自动续签超时时间，这样只要账号一直在使用中，就不会登录超时。'
    },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch' },
    {
      prop: 'status',
      label: t('system.user.status'),
      type: 'radio-group',
      itemList: statusList,
      comment: '锁定的用户账号将无法登录。'
    },
    { type: 'separator', label: t('system.user.job'), hidden: props.handleType !== 'detail' },
    { slotName: 'job', hidden: props.handleType !== 'detail' },
    { type: 'separator', label: t('system.user.inGroup'), hidden: props.handleType !== 'detail' },
    { slotName: 'group', hidden: props.handleType !== 'detail' }
  ]
})

const groupColumns: TableColumn[] = [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'name', label: t('system.user.group.name') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 }
]

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    postSaveUser(formData.value, {
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
