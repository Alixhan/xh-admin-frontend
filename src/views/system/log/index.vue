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
      :fetch-data="queryLogList"
      border
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      is-complex-filter
    >
      <template #right-action>
        <el-button
          v-auth="'system:log:del'"
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
      :title="$t('system.log.detail')"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="1200"
    >
      <LogDetail :handle-type="handleType" :model-value="row" style="height: 75vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delLogByIds, queryLogList } from '@/api/system/log'
import LogDetail from './logDetail.vue'
// import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const tableRef = ref()
const route = useRoute()

const data = ref([])
const selectRows = ref([])
const filterParam = reactive({
  token: route.query.token
})

const topFilterColumns = computed(() => [
  { prop: 'url', label: '请求路径' },
  { prop: 'tag', label: '模块' },
  { prop: 'operation', label: '操作' },
  { prop: 'ip', label: 'ip地址' },
  { prop: 'status', label: '响应状态' },
  { prop: 'token', label: 'token' },
  { prop: 'name', label: '操作用户' },
])

const columns = computed(() => [
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:log:detail',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), auth: 'system:log:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
    ]
  },
  { type: 'index', width: 70 },
  { prop: 'token', label: 'token' },
  { prop: 'url', label: '请求路径' },
  { prop: 'method', label: '请求方法' },
  { prop: 'tag', label: '模块' },
  { prop: 'operation', label: '操作' },
  { prop: 'ip', label: 'ip地址' },
  { prop: 'ipAddress', label: 'ip属地' },
  { prop: 'time', label: '耗时ms', type: 'number' },
  { prop: 'status', label: '响应状态' },
  { prop: 'name', label: '操作用户' },
  { prop: 'localeLabel', label: '使用语言' },
  { prop: 'orgName', label: '使用机构' },
  { prop: 'roleName', label: '使用角色' },

  // { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 }
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
  delLogByIds(rows.map((i) => i.id).join(','), {
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
