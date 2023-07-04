<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      default-expand-all
      row-key="id"
      :is-page="false"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="fetchRoles"
      v-model:data="data"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button type="success" @click="toggleExpand"> 全部 展开/收起</el-button>
      </template>
      <template #right-action>
        <el-button v-auth="'add'" type="primary" icon="plus" @click="openForm('add')"> 新增</el-button>
        <el-button v-auth="'del'" type="danger" icon="delete" :disabled="selectRows.length === 0" @click="del(selectRows)"> 删除 </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="formTitle[handleType]"
      v-model="formVisible"
      draggable
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      width="600px"
    >
      <role-form :handle-type="handleType" :model-value="row" @close="close" style="height: 70vh" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { delRoleByIds, queryRoleList } from '@/api/system/role'
import RoleForm from './roleForm.vue'
import getDictDetails from '@/utils/dict'

const formTitle = {
  add: '角色新增',
  edit: '角色编辑',
  detail: '角色明细',
}

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'name', label: '角色名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
])

const columns = ref([
  { type: 'selection', width: 50 },
  { prop: 'name', label: '角色名称', fixed: false, width: 200 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'enabled', label: '启用', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: '创建时间', type: 'datetime' },
  { prop: 'updateTime', label: '修改时间', type: 'datetime' },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '编辑', icon: 'edit', auth: 'edit', onClick: (row) => openForm('edit', row) },
      { label: '明细', icon: 'Document', auth: 'detail', onClick: (row) => openForm('detail', row) },
      { label: '删除', icon: 'delete', auth: 'del', type: 'danger', onClick: (row) => openForm('', row) },
    ],
  },
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

/**
 * 查询所有角色并变成树形结构
 */
function fetchRoles(pageQuery, option) {
  // 转为树形结构
  return queryRoleList(pageQuery, option).then((res) => {
    const list = res.data.list
    const obj = {}
    list.forEach((i) => {
      i.children = []
      obj[i.id] = i
    })
    res.data.list = list.filter((i) => {
      const parent = obj[i.parentId]
      if (parent) {
        parent.children.push(i)
        return false
      }
      // parentId不存在的为根元素
      return true
    })
    return res
  })
}

const expand = ref(true)

// 展开/收缩所有
function toggleExpand() {
  expand.value = !expand.value
  const arr = [...data.value]
  while (arr.length) {
    const role = arr.pop()
    if (role.children?.length) {
      arr.push(...role.children)
      tableRef.value.tableRef.toggleRowExpansion(role, expand.value)
    }
  }
}

function openForm(type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delRoleByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: '确认删除吗？删除后不可恢复！',
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

function close(type) {
  formVisible.value = false
  if (type === 'refresh') {
    tableRef.value.fetchQuery()
  }
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
