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
        <template #dataPermission>
          <el-col :span="24">
            <m-table ref="tableRef" :columns="tableColumns" :is-page="false" layout="auto" :data="permission" />
          </el-col>
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-auth="'system:role:dataPermission'"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { type PropType, ref, toRef, watchEffect } from 'vue'
import { getRoleById, queryRoleDataPermission, saveRoleDataPermission } from '@/api/system/role'
import { useI18n } from 'vue-i18n'
import MTable from '@/components/table/index.vue'
import MForm from '@/components/form/index.vue'
import { queryDataEntityList, queryDataPermissionList } from '@/api/system/dataPermission'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {
    type: Object as PropType<{
      id?: number
    }>
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()

//查询数据加载状态
const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref<{ [prop: string]: any }>({})
const handleType = toRef(props, 'handleType')

initFormData()

//初始化form数据
async function initFormData() {
  formLoading.value = true
  const promiseArr = [
    queryDataEntityList().then((res) => {
      entityData.value = res.data.map((i) => {
        return {
          value: i.id,
          label: `${i.id} ${i.name}`
        }
      })
    }),
    queryDataPermissionList({ isPage: false, param: {} }).then((res) => {
      permissionData.value = res.data.list.map((i) => {
        return {
          value: i.id,
          label: i.name
        }
      })
    })
  ]
  if (handleType.value !== 'add') {
    promiseArr.push(
      getRoleById(props.modelValue!.id!).then((res) => {
        formData.value = res.data
      }),
      queryRoleDataPermission({ sysRoleId: props.modelValue!.id }).then((res) => {
        permission.value = res.data
      })
    )
  }
  await Promise.all(promiseArr)
  formLoading.value = false
}

// 表单字段根据表单数据变化，有所不同
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'name', label: t('system.role.name'), readonly: true },
    { type: 'separator', label: t('system.dataPermission.label') },
    { slotName: 'dataPermission', label: t('system.dataPermission.label') }
  ]
})

const tableRef = ref()
const entityData = ref([])
const permissionData = ref([])
const tableColumns = [
  {
    width: 100,
    showOverflowTooltip: false,
    notExport: true,
    hidden: handleType.value === 'detail',
    slots: {
      header: () => (
        <el-button onClick={addJob} type="primary" icon="plus" size="small" plain>
          {t('common.add')}
        </el-button>
      ),
      default: (scope) => (
        <el-button onClick={() => delJob(scope.$index)} type="danger" icon="delete" size="small" plain>
          {t('common.del')}
        </el-button>
      )
    }
  },
  {
    prop: 'sysDataEntityId',
    label: t('system.dataPermission.entity'),
    editable: true,
    editParam: {
      type: 'select',
      size: 'small',
      itemList: entityData,
      filterable: true,
      rules: [
        {
          required: true,
          validator: (rule, val, callback, row) => {
            if (val) {
              const du = permission.value.find((i) => i !== row && i.sysDataEntityId === val)
              if (du) return callback(new Error('数据实体不能重复'))
            }
            callback()
          },
          trigger: 'change'
        }
      ]
    }
  },
  {
    prop: 'sysDataPermissionId',
    label: t('system.dataPermission.label'),
    editable: true,
    editParam: {
      type: 'select',
      size: 'small',
      itemList: permissionData,
      filterable: true,
      rules: { required: true, trigger: 'change' }
    }
  }
]

// 权限数据
const permission = ref<any>([])

function addJob() {
  permission.value.push({})
}

function delJob(index: number) {
  permission.value.splice(index, 1)
}

// 保存方法
async function save() {
  await Promise.all([tableRef.value.validate(), formRef.value.submit()])
  await saveRoleDataPermission(
    { sysRoleId: formData.value.id, permissions: permission.value },
    {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }
  )
  close('refresh')
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
