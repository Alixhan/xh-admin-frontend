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
  <el-dialog
    :title="$t('system.org.select')"
    v-model="visible1"
    draggable
    destroy-on-close
    append-to-body
    align-center
    width="80%"
  >
    <select-org selection="single" style="height: calc(90vh - 80px)" @select="selectedOrg" @close="visible1 = false" />
  </el-dialog>
  <el-dialog
    :title="$t('system.role.select')"
    v-model="visible2"
    draggable
    destroy-on-close
    append-to-body
    align-center
    width="80%"
  >
    <select-role selection="single" style="height: calc(90vh - 80px)" @select="selectedRole" />
  </el-dialog>
</template>
<script setup lang="tsx">
import type { PropType, Ref } from 'vue'
import { ref, toRef, watchEffect } from 'vue'
import SelectRole from '@/views/system/role/selectRole.vue'
import SelectOrg from '@/views/system/org/selectOrg.vue'
import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String as PropType<FormHandleType>
  }
})

const { t } = useI18n()

const handleType = toRef(props, 'handleType')

const jobTableRef = ref()

const jobData = defineModel<any[]>({ default: [] })

const jobColumns: Ref<CommonTableColumn[]> = ref([])
watchEffect(() => {
  jobColumns.value = [
    {
      width: 100,
      notExport: true,
      hidden: handleType.value === 'detail',
      slots: {
        header: () => (
          <el-button onClick={addJob} type="primary" icon="plus" size="small">
            {t('common.add')}
          </el-button>
        ),
        default: (scope) => (
          <el-button onClick={() => delJob(scope.$index)} type="danger" icon="delete" size="small">
            {t('common.del')}
          </el-button>
        )
      }
    },
    { type: 'index' },
    {
      minWidth: 200,
      prop: 'orgName',
      label: t('system.org.label'),
      required: handleType.value !== 'detail',
      editable: handleType.value !== 'detail',
      editParam: ({ row }) => {
        return {
          readonly: true,
          size: 'small',
          rules: { required: true },
          slots: {
            append: () => <el-button onClick={() => openOrgSelect(row)} icon="search" size="small" />
          }
        }
      }
    },
    {
      minWidth: 200,
      prop: 'roleName',
      label: t('system.role.label'),
      required: handleType.value !== 'detail',
      editable: handleType.value !== 'detail',
      editParam: ({ row }) => {
        return {
          readonly: true,
          size: 'small',
          rules: { required: true },
          slots: {
            append: () => <el-button onClick={() => openRoleSelect(row)} icon="search" size="small" />
          }
        }
      }
    },
    {
      prop: 'enabled',
      label: t('common.enabled'),
      itemList: getDictDetails(1, 'boolean'),
      type: 'switch',
      editable: handleType.value !== 'detail',
      editParam: { size: 'small' }
    },
    { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 }
  ]
})

function addJob() {
  jobData.value.push({ enabled: true })
}

function delJob(index: number) {
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
  return jobTableRef.value.validate()
}

defineExpose({
  validate
})
</script>
<style lang="scss" scoped></style>
