<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      :is-page="false"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryDataPermissionList"
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action></template>
      <template #right-action>
        <el-button v-auth="'system:dataPermission:add'" type="primary" icon="plus" @click="openForm('add')"
          >{{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:dataPermission:del'"
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
      :title="handleType && $t('system.dataPermission.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="1000px"
    >
      <data-permission-form :handle-type="handleType" :model-value="row" @close="close" style="height: 70vh" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delDataPermissionByIds, queryDataPermissionList } from '@/api/system/dataPermission'
import DataPermissionForm from './dataPermissionForm.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [{ prop: 'name', label: t('system.dataPermission.name') }])

const columns = computed(() => [
  { type: 'index' },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'name', label: t('system.dataPermission.name'), fixed: false, minWidth: 200 },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', minWidth: 155 },
  { prop: 'updateTime', label: t('common.updateTime'), type: 'datetime', minWidth: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('common.edit'),
        icon: 'edit',
        auth: 'system:dataPermission:edit',
        onClick: (row) => openForm('edit', row)
      },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:dataPermission:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        icon: 'delete',
        auth: 'system:dataPermission:del',
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
  delDataPermissionByIds(rows.map((i) => i.id).join(','), {
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
