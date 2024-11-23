<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form ref="formRef" :colspan="12" :columns="columns" :model="formData" :loading="formLoading">
        <template #job>
          <jobs v-model="jobData" ref="jobTableRef" />
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <el-button icon="check" type="primary" :loading="saveLoading" @click="save">{{ $t('common.save') }}</el-button>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import { getUserById, getUserJobs, saveUserJobs } from '@/api/system/user'
import Jobs from '@/views/system/user/jobs.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  //数据类型 1：用户，2：用户组
  type: {
    type: Number as PropType<1 | 2>,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const formRef = ref()
const jobTableRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  enabled: true,
  contentType: '',
  object: '',
  name: ''
})

init()

async function init() {
  // 查询明细
  formLoading.value = true
  await getUserById(props.userId).then((res) => {
    formData.value = res.data
  })
  await getUserJobs({
    type: props.type!,
    userId: props.userId!
  }).then((res) => {
    jobData.value = res.data
  })
  formLoading.value = false
}

// 表单列定义
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'avatar', label: t('system.user.avatar'), type: 'upload-img', cols: 2, single: 'object', disabled: true },
    { prop: 'code', label: t('system.user.code'), disabled: true },
    { prop: 'name', label: t('system.user.name'), disabled: true },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch', disabled: true },
    { type: 'separator', label: t('system.user.job') },
    { slotName: 'job' }
  ]
})

const jobData = ref<any[]>([])

// 保存方法
async function save() {
  await formRef.value.submit()
  await jobTableRef.value.validate()
  saveUserJobs(
    {
      type: props.type!,
      userId: props.userId!,
      jobData: jobData.value
    },
    {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('system.user.jobSuccess')
    }
  ).then(() => close())
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

.m-form-scroll {
  flex-grow: 0;
  height: auto;
}
</style>
