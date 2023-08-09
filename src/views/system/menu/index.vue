<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      :is-page="false"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="fetchMenus"
      v-model:data="data"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button type="success" @click="toggleExpand"> 全部 展开/收起</el-button>
      </template>
      <template #right-action>
        <el-button v-auth="'add'" type="primary" icon="plus" @click="openForm('add')"> 新增</el-button>
        <el-button
          v-auth="'del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
        >
          删除
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="formTitle[handleType]"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      width="70%"
      append-to-body
    >
      <menu-form :handle-type="handleType" :model-value="row" style="height: 75vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { delMenuByIds, postSwitchMenuProp, queryMenuList } from '@/api/system/menu'
import { menuTypeList } from '@/views/system/menu/constant'
import MenuForm from './menuForm.vue'
import getDictDetails from '@/utils/dict'

const formTitle = {
  copy: '菜单复制',
  add: '菜单新增',
  edit: '菜单编辑',
  detail: '菜单明细',
}

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'title', label: '菜单标题' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
])

const columns = ref([
  { type: 'selection', width: 50 },
  { prop: 'title', label: '菜单标题', fixed: false, width: 200 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'platform', label: '平台' },
  { prop: 'name', label: 'name' },
  { prop: 'type', label: '菜单类型', type: 'select', itemList: menuTypeList },
  { prop: 'icon', label: '菜单图标', slots: { default: generateMenuIcon } },
  {
    prop: 'cache',
    label: '缓存',
    itemList: getDictDetails(1, 'boolean'),
    slots: { default: switchSlot },
  },
  {
    prop: 'enabled',
    label: '启用',
    itemList: getDictDetails(1, 'boolean'),
    slots: { default: switchSlot },
  },
  {
    prop: 'order',
    label: '排序号',
    width: 85,
    comment: '菜单的排列顺序，小号排在前，大号排在后。',
  },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  { prop: 'updateTime', label: '修改时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '复制', auth: 'add', onClick: (row) => openForm('copy', row) },
      { label: '编辑', auth: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: '明细',
        auth: 'detail',
        onClick: (row) => openForm('detail', row),
      },
      {
        label: '删除',
        auth: 'del',
        type: 'danger',
        onClick: (row) => del([row]),
      },
    ],
  },
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

/**
 * 查询所有菜单并变成树形结构
 */
function fetchMenus(pageQuery, option) {
  // 转为树形结构
  return queryMenuList(pageQuery, option).then((res) => {
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

const expand = ref(false)

// 展开/收缩所有
function toggleExpand() {
  expand.value = !expand.value
  const arr = [...data.value]
  while (arr.length) {
    const menu = arr.pop()
    if (menu.children?.length) {
      arr.push(...menu.children)
      tableRef.value.tableRef.toggleRowExpansion(menu, expand.value)
    }
  }
}

//打开表单明细弹框
function openForm(type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

// 生成菜单的图标
function generateMenuIcon(scope) {
  const menu = scope.row
  if (menu.type === 'btn') return '--'
  return (
    <m-icon
      {...{
        size: 18,
        modelValue: menu.icon,
      }}
    />
  )
}

function switchSlot(scope) {
  const row = scope.row
  if (scope.column.property === 'cache' && (row.type !== 'menu' || row.handleType === 'outer')) {
    return '--'
  }
  const prop = scope.column.property
  return (
    <el-switch
      size="small"
      v-model={row[prop]}
      beforeChange={async () => {
        const requestParam = {
          id: row.id,
          prop,
          value: !row[prop],
        }
        await postSwitchMenuProp(requestParam, { showLoading: true })
        return true
      }}
    />
  )
}

function del(rows) {
  delMenuByIds(rows.map((i) => i.id).join(','), {
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
