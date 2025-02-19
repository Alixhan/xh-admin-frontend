<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
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
        <el-button v-auth="'system:user:import'" type="primary" icon="upload" @click="userImportRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'system:user:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:user:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >{{ $t('common.del') }}
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('system.user.' + handleType)"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="500px"
    >
      <user-form :handle-type="handleType" :model-value="row" @close="close" />
    </el-dialog>
    <el-dialog
      :title="$t('system.user.job')"
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
    <el-dialog
      :title="$t('system.user.resetPassword')"
      v-model="formVisible3"
      align-center
      draggable
      destroy-on-close
      append-to-body
      width="400px"
    >
      <ResetPassword :model-value="row" @close="formVisible3 = false" />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import type { Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { delUserByIds, queryUserList } from '@/api/system/user'
import { statusList } from '@/views/system/user/constant.js'
import UserForm from './userForm.vue'
import getDictDetails from '@/utils/dict'
import UserImport from './userImport.vue'
import ResetPassword from './resetPassword.vue'
import UserJob from '@/views/system/user/userJob.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'code', label: t('system.user.code') },
  { prop: 'name', label: t('system.user.name') }
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'code', label: t('system.user.code') },
  { prop: 'name', label: t('system.user.name') },
  { prop: 'telephone', label: t('system.user.telephone') },
  { prop: 'status', label: t('system.user.status'), type: 'select', itemList: statusList },
  { prop: 'lockMsg', label: t('system.user.lockMsg') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'system:user:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('system.user.jobMaintain'),
        auth: 'system:user:role',
        icon: 'stamp',
        onClick: (row) => openForm('job', row)
      },
      {
        label: t('common.detail'),
        auth: 'system:user:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('system.user.resetPassword'),
        auth: 'system:user:resetPassword',
        icon: 'RefreshLeft',
        type: 'warning',
        onClick: (row) => openForm('resetPassword', row)
      },
      { label: t('common.del'), auth: 'system:user:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
    ]
  }
])

const formVisible = ref(false)
const formVisible2 = ref(false)
const formVisible3 = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType | 'job' | 'resetPassword', r) {
  row.value = r
  if (type === 'job') {
    formVisible2.value = true
    return
  }
  if (type === 'resetPassword') {
    formVisible3.value = true
    return
  }
  formVisible.value = true
  handleType.value = type
}

function del(rows: any[]) {
  delUserByIds(rows.map((i) => i.id).join(','), {
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

const userImportRef = ref()
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
