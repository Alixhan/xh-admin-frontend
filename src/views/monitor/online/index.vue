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
      selection="multiple"
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
  { type: 'index', label: '序', width: 70 },
  { prop: 'token', label: 'token' },
  { prop: 'userCode', label: '登录账户' },
  { prop: 'userName', label: '登录账户名称' },
  { prop: 'loginTime', label: '登录时间', type: 'datetime', minWidth: 150 },
  { prop: 'loginIp', label: 'ip地址', minWidth: 120 },
  { prop: 'loginAddress', label: '登录地点', minWidth: 150 },
  { prop: 'loginBrowser', label: '浏览器' },
  { prop: 'browserVersion', label: '浏览器版本' },
  { prop: 'loginOs', label: '操作系统' },
  { prop: 'isMobile', label: '是否手机端', itemList: getDictDetails(1, 'boolean') },
  { prop: 'orgName', label: '登录机构' },
  { prop: 'roleName', label: '登录角色' },
  { prop: 'localeLabel', label: '当前使用语言' },
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
