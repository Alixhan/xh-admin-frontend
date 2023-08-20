<template>
  <m-table
    ref="jobTableRef"
    :is-page="false"
    style="width: 100%"
    :columns="jobColumns"
    layout="auto"
    :data="jobData"
    row-key="id"
  />
  <el-dialog title="选择机构" v-model="visible1" draggable append-to-body align-center width="80%">
    <selectOrg selection="single" style="height: calc(90vh - 80px)" @select="selectedOrg" @close="visible1 = false" />
  </el-dialog>
  <el-dialog title="选择角色" v-model="visible2" draggable append-to-body align-center width="80%">
    <select-role selection="single" style="height: calc(90vh - 80px)" @select="selectedRole" />
  </el-dialog>
</template>
<script setup lang="tsx">
import { ref, toRef, watchEffect } from 'vue'
import type { PropType } from 'vue'
import SelectRole from '@/views/system/role/selectRole.vue'
import SelectOrg from '@/views/system/org/selectOrg.vue'
import getDictDetails from '@/utils/dict'

const props = defineProps({
  handleType: {
    type: String as PropType<FormHandleType>,
  },
})

const handleType = toRef(props, 'handleType')

const jobTableRef = ref()

const jobData = defineModel<any[]>({ default: [] })

const jobColumns = ref<TableColumn[]>([])
watchEffect(() => {
  jobColumns.value = [
    {
      width: 100,
      notExport: true,
      hidden: handleType.value === 'detail',
      slots: {
        header: () => (
          <el-button onClick={addJob} type="primary" icon="plus">
            新增
          </el-button>
        ),
        default: (scope) => (
          <el-button onClick={() => delJob(scope.$index)} type="danger" icon="delete">
            删除
          </el-button>
        ),
      },
    },
    { type: 'index' },
    {
      minWidth: 200,
      prop: 'orgName',
      label: '机构',
      required: handleType.value !== 'detail',
      editable: handleType.value !== 'detail',
      editParam: (scope) => {
        return {
          readonly: true,
          rules: { required: true },
          slots: {
            append: () => <el-button onClick={() => openOrgSelect(scope.row)} icon="search" />,
          },
        }
      },
    },
    {
      minWidth: 200,
      prop: 'roleName',
      label: '角色',
      required: handleType.value !== 'detail',
      editable: handleType.value !== 'detail',
      editParam: (scope) => {
        return {
          readonly: true,
          rules: { required: true },
          slots: {
            append: () => <el-button onClick={() => openRoleSelect(scope.row)} icon="search" />,
          },
        }
      },
    },
    {
      prop: 'enabled',
      label: '启用',
      itemList: getDictDetails(1, 'boolean'),
      type: 'switch',
      editable: handleType.value !== 'detail',
    },
    { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  ]
})

function addJob() {
  jobData.value.push({ enabled: true })
}

function delJob(index) {
  jobData.value.splice(index, 1)
}

const visible1 = ref(false)
const visible2 = ref(false)
let currentRow

function openOrgSelect(row) {
  currentRow = row
  visible1.value = true
}

// 选择了机构
function selectedOrg(rows) {
  currentRow.sysOrgId = rows[0].id
  currentRow.orgName = rows[0].name
  visible1.value = false
}

function openRoleSelect(row) {
  currentRow = row
  visible2.value = true
}

// 选择了角色数据
function selectedRole(rows) {
  currentRow.sysRoleId = rows[0].id
  currentRow.roleName = rows[0].name
  visible2.value = false
}

// 验证方法
function validate() {
  return jobTableRef.value.formRef.validate()
}

defineExpose({
  validate,
})
</script>
<style lang="scss" scoped></style>
