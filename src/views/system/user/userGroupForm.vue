<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      >
        <template #job>
          <jobs ref="jobTableRef" v-model="jobData" :handle-type="handleType" />
        </template>
        <template #member>
          <m-table
            ref="userTableRef"
            style="width: 100%"
            :columns="memberColumns"
            layout="auto"
            :data="formData.memberData"
            row-key="id"
          />
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['system:userGroup:add', 'system:userGroup:edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        保存
      </el-button>
    </div>
    <el-dialog title="选择用户" v-model="visible1" draggable append-to-body align-center width="80%">
      <select-user style="height: calc(90vh - 80px)" @select="selectedUser" />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, toRef, watchEffect } from 'vue'
import { getUserGroupById, getUserJobs, saveUserGroup } from '@/api/system/user'
import Jobs from '@/views/system/user/jobs.vue'
import SelectUser from '@/views/system/user/selectUser.vue'

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

const handleType = toRef(props, 'handleType')

const formRef = ref()
const jobTableRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  enabled: true,
  memberData: [] as any [],
})

if (props.handleType !== 'add') {
  // 查询明细
  init()

  async function init() {
    // 查询明细
    formLoading.value = true
    await getUserGroupById(props.modelValue!.id).then((res) => {
      formData.value = res.data
    })
    await getUserJobs({
      type: 2,
      userId: props.modelValue!.id!,
    }).then((res) => {
      jobData.value = res.data
    })
    formLoading.value = false
  }
}

// 表单列定义
const columns = ref<FormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'name', label: '用户组名称', rules: { required: true } },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
    { type: 'separator', label: '用户组岗位' },
    { slotName: 'job' },
    { type: 'separator', label: '用户组成员' },
    { slotName: 'member' },
  ]
})

const jobData = ref<any[]>([])

const memberColumns = ref<TableColumn[]>([])
watchEffect(() => {
  memberColumns.value = [
    {
      width: 100,
      hidden: handleType.value === 'detail',
      notExport: true,
      slots: {
        header: () => (
          <el-button onClick={addUser} type="primary" icon="plus">
            新增
          </el-button>
        ),
        default: (scope) => (
          <el-button onClick={() => delUser(scope.$index)} type="danger" icon="delete">
            删除
          </el-button>
        ),
      },
    },
    { type: 'index' },
    { prop: 'userCode', label: '用户账号' },
    { prop: 'userName', label: '用户名称' },
    { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  ]
})

function addUser() {
  visible1.value = true
}

function delUser(index) {
  formData.value.memberData.splice(index, 1)
}

const visible1 = ref(false)

// 选择了机构
function selectedUser(rows) {
  const addUser = rows
    .filter((i) => !formData.value.memberData.some((j) => j.sysUserId === i.id))
    .map((i) => {
      return {
        sysUserId: i.id,
        userCode: i.code,
        userName: i.name,
      }
    })
  formData.value.memberData.push(...addUser)
  visible1.value = false
}

// 保存方法
function save() {
  Promise.all([jobTableRef.value.validate(), formRef.value.submit()]).then(() => {
    saveUserGroup(
      { ...formData.value, jobData: jobData.value },
      {
        loadingRef: saveLoading,
        showSuccessMsg: true,
        successMsg: '保存成功',
      }
    ).then(() => close('refresh'))
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
