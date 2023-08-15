<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef2"
      is-filter-table
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryUserGroupList"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'system:userGroup:add'" type="primary" icon="plus" @click="openForm('add', null)">新增</el-button>
        <el-button
          v-auth="'system:userGroup:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >删除
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="formTitle[handleType]"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="60%"
    >
      <user-group-form :handle-type="handleType" :model-value="row" @close="close" style="height: 70vh" />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref, shallowRef } from 'vue'
import { delUserGroupByIds, queryUserGroupList } from '@/api/system/user'
import getDictDetails from '@/utils/dict'
import UserGroupForm from '@/views/system/user/userGroupForm.vue'

const formTitle = {
  add: '用户组新增',
  edit: '用户组编辑',
  detail: '用户组明细',
}

const tableRef2 = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([{ prop: 'name', label: '用户组名' }])

const columns = ref<TableColumn[]>([
  { type: 'selection', width: 50 },
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'name', label: '用户组名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '编辑', auth: 'system:userGroup:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      { label: '明细', auth: 'system:userGroup:detail', icon: 'document', onClick: (row) => openForm('detail', row) },
      { label: '删除', auth: 'system:userGroup:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) },
    ],
  },
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delUserGroupByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: '确认删除吗？删除后不可恢复！',
  }).then(() => {
    tableRef2.value.fetchQuery()
  })
}

function close(type) {
  formVisible.value = false
  if (type === 'refresh') {
    tableRef2.value.fetchQuery()
  }
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
