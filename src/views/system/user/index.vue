<template>
  <div class="root">
    <div class="user-tabs">
      <div v-for="tab in tabs" :key="tab.id" :class="{ 'active-tab': tab.id === activeTab }" @click="activeTab = tab.id">
        {{ tab.label }}
      </div>
    </div>
    <m-table
      v-show="activeTab === 1"
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryUserList"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'del'" type="danger" icon="delete" :disabled="selectRows.length === 0" @click="del(selectRows)">删除 </el-button>
      </template>
    </m-table>
    <m-table
      v-show="activeTab === 2"
      class="m-table"
      ref="tableRef2"
      is-filter-table
      row-key="id"
      :filter-param="filterParam2"
      :filter-columns="topFilterColumns2"
      :columns="columns2"
      :fetch-data="queryUserList"
      @selection-change="(rows) => (selectRows2 = rows)"
      v-model:data="data2"
    >
      <template #right-action>
        <el-button v-auth="'del'" type="danger" icon="delete" :disabled="selectRows2.length === 0" @click="del(selectRows2)">删除 </el-button>
      </template>
    </m-table>
    <el-dialog :title="formTitle[handleType]" v-model="formVisible" align-center draggable destroy-on-close
:close-on-click-modal="false" width="70%">
      <file-form :handle-type="handleType" :model-value="row" style="height: 75vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { delUserByIds, queryUserList } from '@/api/system/user'
import { statusList } from '@/views/system/file/constant'
import FileForm from './userForm.vue'
import getDictDetails from '@/utils/dict'

const formTitle = {
  edit: '文件编辑',
  detail: '文件明细'
}

const tabs = [
  { id: 1, label: '用户管理' },
  { id: 2, label: '用户组管理' }
]
const activeTab = ref(1)

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([{ prop: 'name', label: '用户名' }])

const columns = ref([
  { type: 'selection', width: 50 },
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'code', label: '用户账号' },
  { prop: 'name', label: '用户名称' },
  { prop: 'status', label: '用户状态', type: 'select', itemList: statusList },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1) },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    width: 130,
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '编辑', auth: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: '明细',
        auth: 'detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: '删除',
        auth: 'del',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  }
])

const tableRef2 = ref()
const data2 = ref([])
const selectRows2 = ref([])

const filterParam2 = reactive({})

const topFilterColumns2 = shallowRef([{ prop: 'name', label: '用户名' }])

const columns2 = ref([
  { type: 'selection', width: 50 },
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'code', label: '用户组名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1) },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    width: 130,
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '编辑', auth: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: '明细',
        auth: 'detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: '删除',
        auth: 'del',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delUserByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: '确认删除吗？此操作会删除实际文件，删除后不可恢复！'
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
.root {
  display: flex;
  flex-direction: column;

  .user-tabs {
    flex-shrink: 0;
    border: none;
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    > div {
      font-weight: bold;
      font-family: var(--el-font-family);
      font-size: 14px;
      color: var(--el-text-color-regular);
      border-radius: 5px;
      cursor: pointer;
      padding: 8px 20px;

      &:hover {
        background-color: var(--el-bg-color);
      }
    }

    .active-tab {
      background-color: var(--el-bg-color);
      color: var(--el-color-primary);
    }
  }

  .m-table {
    height: 0;
    flex-grow: 1;
  }
}
</style>
