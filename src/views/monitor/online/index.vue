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
import { computed, reactive, ref } from 'vue'
import { kickOut, queryOnlineUser } from '@/api/system/user'
import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import { ElNotification } from 'element-plus'

defineOptions({
  name: 'OnlineUser'
})

const { t } = useI18n()

const tableRef = ref()
const data = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'userCode', label: t('monitor.online.userCode') },
  { prop: 'userName', label: t('monitor.online.userName') },
  { prop: 'ip', label: 'Ip' }
])

const columns = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'token', label: 'Token' },
  { prop: 'userCode', label: t('monitor.online.userCode') },
  { prop: 'userName', label: t('monitor.online.userName') },
  { prop: 'loginTime', label: t('monitor.online.loginTime'), type: 'datetime', minWidth: 150 },
  { prop: 'loginIp', label: 'Ip', minWidth: 120 },
  { prop: 'loginAddress', label: t('monitor.online.loginAddress'), minWidth: 150 },
  { prop: 'loginBrowser', label: t('monitor.online.loginBrowser') },
  { prop: 'browserVersion', label: t('monitor.online.browserVersion') },
  { prop: 'loginOs', label: t('monitor.online.loginOs') },
  { prop: 'isMobile', label: t('monitor.online.isMobile'), itemList: getDictDetails(1, 'boolean') },
  { prop: 'orgName', label: t('monitor.online.orgName') },
  { prop: 'roleName', label: t('monitor.online.roleName') },
  { prop: 'localeLabel', label: t('monitor.online.localeLabel') },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('monitor.online.forceLogout'), onClick: foreOffline },
      { label: '查询日志', auth: 'system:log', onClick: toLog }
    ]
  }
])

// 强制下线
function foreOffline(row) {
  kickOut(row.token, {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: t('monitor.online.confirmLogout')
  }).then(tableRef.value.fetchQuery)
}

const router = useRouter()
const systemStore = useSystemStore()

function toLog(row) {
  const logMenu = systemStore.menus.find((i) => 'system:log' === i.name)
  if (!logMenu) {
    return ElNotification({
      type: 'error',
      message: '无日志菜单权限',
      duration: 3000
    })
  }
  router.push({
    path: logMenu.fullPath,
    query: {
      token: row.token
    }
  })
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>
