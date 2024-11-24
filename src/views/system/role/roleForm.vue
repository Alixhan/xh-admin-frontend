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
        <template #permission>
          <el-col :span="24">
            <el-form-item :label="$t('system.role.permission')">
              <el-tree
                ref="menuTreeRef"
                style="width: 100%"
                default-expand-all
                show-checkbox
                :props="treeOption"
                node-key="id"
                :data="menuTrees"
                :default-checked-keys="checkedMenus"
              />
            </el-form-item>
          </el-col>
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['system:role:add', 'system:role:edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
    <el-dialog
      :title="$t('system.role.selectParent')"
      v-model="visible"
      draggable
      append-to-body
      align-center
      width="80%"
    >
      <select-role
        selection="single"
        style="height: calc(90vh - 80px)"
        @select="selectedParentRole"
        @clear="clearParentRole"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, toRef, watchEffect } from 'vue'
import { getRoleById, postSaveRole, queryRoleMenu } from '@/api/system/role'
import SelectRole from '@/views/system/role/selectRole.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {
    type: Object as PropType<{
      id?: number
      [prop: string]: any
    }>
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const treeOption = {
  children: 'children',
  label: 'title',
  class: (data) => {
    if (data.type === 'menu') {
      return 'menu-node'
    }
  }
}

interface TreeNode {
  id: number
  title: string
  children?: TreeNode[]
}

//查询数据加载状态
const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref<{ [prop: string]: any }>({
  cache: true,
  enabled: true
})
const handleType = toRef(props, 'handleType')
const menuTreeRef = ref()
//权限树形结构数据
const menuTrees = ref<TreeNode[]>([])
let roleMenus: any[] = []
const checkedMenus = ref([])
initFormData()

//初始化form数据
async function initFormData() {
  formLoading.value = true
  if (handleType.value !== 'add') {
    // 查询明细
    await getRoleById(props.modelValue!.id!).then((res) => {
      formData.value = res.data
      checkedMenus.value = formData.value.roleMenus.map((i) => i.sysMenuId)
      if (handleType.value === 'copy') {
        handleType.value = 'add'
        formData.value.id = ''
      }
    })
  }
  await initRoleMenus()
  // 查询所有菜单权限
  checkedMenus.value = checkedMenus.value.filter((i) => {
    return !roleMenus.find((j) => j.id === i)?.children?.length
  })
  formLoading.value = false
}

//初始化可选权限菜单数据
async function initRoleMenus() {
  menuTrees.value = []
  return queryRoleMenu({ parentId: formData.value.parentId }).then((res) => {
    roleMenus = res.data
    const obj = {}
    roleMenus.forEach((i) => {
      i.children = []
      obj[i.id] = i
    })
    menuTrees.value = [
      {
        id: 0,
        title: t('common.all'),
        children: roleMenus.filter((i) => {
          const parent = obj[i.parentId]
          if (parent) {
            parent.children.push(i)
            return false
          }
          // parentId不存在的为根元素
          return true
        })
      }
    ]
  })
}

const visible = ref(false)

// 选择了上级角色数据
function selectedParentRole(rows) {
  formData.value.parentId = rows[0].id
  formData.value.parentName = rows[0].name
  visible.value = false
  //上级角色变更需要重新获取可选菜单权限
  initRoleMenus()
}

//清空上级角色
function clearParentRole() {
  formData.value.parentId = ''
  formData.value.parentName = ''
  visible.value = false
  //上级角色变更需要重新获取可选菜单权限
  initRoleMenus()
}

// 表单字段根据表单数据变化，有所不同
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'parentId',
      label: t('system.role.parentId'),
      clearable: true,
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible.value = true)}>{t('common.select')}</el-button>
        }
      }
    },
    { prop: 'parentName', label: t('system.role.parentName'), readonly: true },
    { prop: 'name', label: t('system.role.name'), rules: { required: true } },
    { prop: 'enabled', label: t('common.isEnabled'), type: 'switch' },
    { slotName: 'permission', label: t('system.role.permission') }
  ]
})

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    formData.value.roleMenus = menuTreeRef.value
      .getCheckedNodes(false, true)
      .filter((i) => i.id !== 0)
      .map((i) => {
        return {
          sysMenuId: i.id
        }
      })
    postSaveRole(formData.value, {
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

:deep(.menu-node) {
  > .el-tree-node__children {
    padding-left: 70px;
    display: flex;
    flex-wrap: wrap;

    .el-tree-node__content {
      padding: 0 6px !important;
      line-height: 100%;

      .el-tree-node__expand-icon {
        display: none;
      }
    }
  }
}
</style>
