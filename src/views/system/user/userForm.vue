<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll" :style="handleType === 'detail' && 'height: 65vh;'">
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
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['system:user:add', 'system:user:edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import { getUserById, getUserGroups, getUserJobs, postSaveUser } from '@/api/system/user'
import Jobs from '@/views/system/user/jobs.vue'

const props = defineProps({
  handleType: {
    type: String as PropType<FormHandleType>,
    default: 'add',
  },
  modelValue: {
    type: Object as PropType<{ id: number }>,
  },
})
const emit = defineEmits(['close'])

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  enabled: true,
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
      userId: props.modelValue!.id!,
    }),
    getUserGroups(props.modelValue!.id),
  ]).then(([a, b, c]) => {
    formData.value = a.data
    jobData.value = b.data
    groupData.value = c.data
    formLoading.value = false
  })
}

// 表单列定义
const columns = ref<FormColumn[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'code',
      label: '登录账号',
      rules: [{ required: true }, { pattern: /[a-zA-Z0-9]+/, message: '登录账号只能是大小写字母和数字！' }],
    },
    { prop: 'name', label: '用户名', rules: { required: true } },
    { prop: 'avatar', label: '头像', type: 'upload-img', single: 'object' },
    { prop: 'password', label: '初始密码', hidden: props.handleType !== 'add' },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
    { type: 'separator', label: '用户岗位', hidden: props.handleType !== 'detail' },
    { slotName: 'job', hidden: props.handleType !== 'detail' },
    { type: 'separator', label: '所在用户组', hidden: props.handleType !== 'detail' },
    { slotName: 'group', hidden: props.handleType !== 'detail' },
  ]
})

const groupColumns: TableColumn[] = [
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'name', label: '用户组名称' },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
]

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    postSaveUser(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功',
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

.m-form-scroll {
  flex-grow: 0;
  height: auto;
}
</style>
