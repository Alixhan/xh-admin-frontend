<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType2"
        :loading="formLoading"
      >
        <template #permission>
          <el-col :span="24">
            <el-form-item label="权限">
              <template #label></template>
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
      <el-button icon="close" @click="close()">取消</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType2)"
          v-auth="['add', 'edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          保存
        </el-button>
      </template>
    </div>
    <el-dialog title="选择上级角色" v-model="visible" draggable append-to-body align-center
               width="80%">
      <select-role selection="single" style="height: calc(90vh - 80px)" @select="selectedParentRole"  @clear="clearParentRole" />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import { ref, watchEffect } from 'vue'
import type { PropType } from 'vue'
import { getRoleById, postSaveRole, queryRoleMenu } from '@/api/system/role'
import SelectRole from '@/views/system/role/selectRole.vue'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add',
  },
  modelValue: {
    type: Object as PropType<{
      id?: number
      [prop: string]: any
    }>,
  },
})
const emit = defineEmits(['close'])

const treeOption = {
  children: 'children',
  label: 'title',
  class: (data) => {
    if (data.type === 'menu') {
      return 'menu-node'
    }
  },
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
  enabled: true,
})
const handleType2 = ref(props.handleType)
const menuTreeRef = ref()
//权限树形结构数据
const menuTrees = ref<TreeNode[]>([])
let roleMenus = []
const checkedMenus = ref([])
initFormData()

//初始化form数据
async function initFormData() {
  formLoading.value = true
  if (handleType2.value !== 'add') {
    // 查询明细
    await getRoleById(props.modelValue!.id).then((res) => {
      formData.value = res.data
      checkedMenus.value = formData.value.roleMenus.map(i => i.sysMenuId)
      if (handleType2.value === 'copy') {
        handleType2.value = 'add'
        formData.value.id = ''
      }
    })
  }
  await initRoleMenus()
  // 查询所有菜单权限
  checkedMenus.value = checkedMenus.value.filter(i => {
    return !(roleMenus.find(j => j.id === i)?.children?.length)
  })
  formLoading.value = false
}

//初始化可选权限菜单数据
function initRoleMenus(){
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
        title: '全部',
        children: roleMenus.filter((i) => {
          const parent = obj[i.parentId]
          if (parent) {
            parent.children.push(i)
            return false
          }
          // parentId不存在的为根元素
          return true
        }),
      },
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
function clearParentRole(){
  formData.value.parentId = ''
  formData.value.parentName = ''
  visible.value = false
  //上级角色变更需要重新获取可选菜单权限
  initRoleMenus()
}

// 表单字段根据表单数据变化，有所不同
const columns = ref<CommonColumn[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'parentId',
      label: '上级角色id',
      clearable: true,
      readonly: true,
      slots: {
        append() {
          return <el-button onClick={() => (visible.value = true)}>选择</el-button>
        },
      },
    },
    { prop: 'parentName', label: '上级角色名称', readonly: true },
    { prop: 'name', label: '角色名称', rules: { required: true } },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
    { slotName: 'permission', label: '权限' },
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
