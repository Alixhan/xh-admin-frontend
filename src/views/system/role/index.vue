<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      default-expand-all
      row-key="id"
      :is-page="false"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="fetchRoles"
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button type="success" @click="toggleExpand">
          {{ $t('common.expand') }}/{{ $t('common.collapse') }} {{ $t('common.all') }}
        </el-button>
      </template>
      <template #right-action>
        <el-button v-auth="'system:role:add'" type="primary" icon="plus" @click="openForm('add')"
          >{{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:role:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
        >
          {{ $t('common.del') }}
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('system.role.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="600px"
    >
      <role-form :handle-type="handleType" :model-value="row" @close="close" style="height: 70vh" />
    </el-dialog>
    <el-dialog
      :title="$t('system.dataPermission.label')"
      v-model="formVisible2"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="700px"
    >
      <data-permission :handle-type="handleType" :model-value="row" @close="close" style="height: 70vh" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delRoleByIds, queryRoleList } from '@/api/system/role'
import RoleForm from './roleForm.vue'
import DataPermission from './dataPermission.vue'
import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'name', label: t('system.role.name') },
  { prop: 'enabled', label: t('common.enabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

const columns = computed(() => [
  { prop: 'name', label: t('system.role.name'), fixed: false, width: 200 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'enabled', label: t('common.enabled'), itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  { prop: 'updateTime', label: t('common.updateTime'), type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('system.dataPermission.label'),
        icon: 'key',
        auth: 'system:role:dataPermission',
        onClick: (row) => openForm('dataPermission', row)
      },
      { label: t('common.edit'), icon: 'edit', auth: 'system:role:edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:role:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        icon: 'delete',
        auth: 'system:role:del',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  }
])

const formVisible = ref(false)
const formVisible2 = ref(false)
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
  handleType.value = type

  if (type === 'dataPermission') formVisible2.value = true
  else formVisible.value = true
}

function del(rows) {
  delRoleByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: t('common.confirmDelete')
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

function close(type) {
  formVisible.value = false
  formVisible2.value = false
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
