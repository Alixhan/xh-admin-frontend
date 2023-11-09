<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryUserList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'system:user:import'" type="primary" icon="upload" @click="userImportRef.open()"
          >导入
        </el-button>
        <el-button v-auth="'system:user:add'" type="primary" icon="plus" @click="openForm('add', null)">新增</el-button>
        <el-button
          v-auth="'system:user:del'"
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
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="50%"
    >
      <user-form :handle-type="handleType" :model-value="row" @close="close" />
    </el-dialog>
    <el-dialog
      title="用户岗位"
      v-model="formVisible2"
      align-center
      draggable
      destroy-on-close
      append-to-body
      width="70%"
    >
      <user-job :model-value="row" @close="formVisible2 = false" :user-id="row.id" :type="1" style="height: 70vh" />
    </el-dialog>
    <user-import ref="userImportRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import type { Ref } from 'vue'
import { reactive, ref, shallowRef } from 'vue'
import { delUserByIds, queryUserList } from '@/api/system/user'
import { statusList } from '@/views/system/user/constant.js'
import UserForm from './userForm.vue'
import getDictDetails from '@/utils/dict'
import UserImport from './userImport.vue'
import UserJob from '@/views/system/user/userJob.vue'

const formTitle = {
  add: '用户新增',
  edit: '用户编辑',
  detail: '用户明细',
}
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'code', label: '用户账号' },
  { prop: 'name', label: '用户名' },
])

const columns: Ref<Array<TableColumn>> = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'code', label: '用户账号' },
  { prop: 'name', label: '用户名称' },
  { prop: 'telephone', label: '手机号码' },
  { prop: 'status', label: '用户状态', type: 'select', itemList: statusList },
  { prop: 'lockMsg', label: '锁定原因' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '编辑', auth: 'system:user:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      { label: '岗位维护', auth: 'system:user:role', icon: 'stamp', onClick: (row) => openForm('job', row) },
      { label: '明细', auth: 'system:user:detail', icon: 'document', onClick: (row) => openForm('detail', row) },
      { label: '删除', auth: 'system:user:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) },
    ],
  },
])

const formVisible = ref(false)
const formVisible2 = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType | 'job', r) {
  row.value = r
  if (type === 'job') {
    formVisible2.value = true
    return
  }
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delUserByIds(rows.map((i) => i.id).join(','), {
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
  formVisible2.value = false
  if (type === 'refresh') {
    tableRef.value.fetchQuery()
  }
}

const userImportRef = ref()
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
