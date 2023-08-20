<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryOnlineUser"
      v-model:data="data"
    />
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { kickOut, queryOnlineUser } from '@/api/system/user'
import getDictDetails from '@/utils/dict'

const tableRef = ref()
const data = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'userCode', label: '登录账号' },
  { prop: 'userName', label: '账号名称' },
  { prop: 'ip', label: '登录ip' },
])

const columns = ref([
  { type: 'selection', width: 50 },
  { type: 'index', label: '序', width: 50 },
  { prop: 'token', label: 'token' },
  { prop: 'userCode', label: '登录账户' },
  { prop: 'userName', label: '登录账户名称' },
  { prop: 'loginTime', label: '登录时间', type: 'datetime', minWidth: 110 },
  { prop: 'loginIp', label: 'ip地址' },
  { prop: 'loginAddress', label: '登录地点' },
  { prop: 'loginBrowser', label: '浏览器' },
  { prop: 'browserVersion', label: '浏览器版本' },
  { prop: 'loginOs', label: '操作系统' },
  { prop: 'isMobile', label: '是否手机端', itemList: getDictDetails(1, 'boolean') },
  { prop: 'orgName', label: '登录机构' },
  { prop: 'roleName', label: '登录角色' },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [{ label: '强制下线', onClick: foreOffline }],
  },
])

// 强制下线
function foreOffline(row) {
  kickOut(row.token, {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: '确认踢除此用户下线吗？踢除成功后，该用户需要重新登录！',
  }).then(tableRef.value.fetchQuery)
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
