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
      :fetch-data="queryGaimiAccountList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'gaimi:account:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'gaimi:account:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >{{ $t('common.del') }}
        </el-button>
        <el-button
          type="primary"
          icon="Promotion"
          :disabled="selectRows.length === 0"
          @click="login(selectRows)"
          >批量登录
        </el-button>
      </template>
    </m-table>
    <div class="console-view">
      <div style="display: flex; gap: 20px">
        <el-checkbox v-model="enabled">定时器状态</el-checkbox>
        <el-text><el-input-number v-model="minutes" />分钟</el-text>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="refresh">手动执行刷新</el-button>
      </div>
      <div>
        <el-text>
          执行器连接状态：
          <el-text :type="statusText[socketStatus].type">{{ statusText[socketStatus].text }}</el-text>
          <el-checkbox v-model="headless">无头模式</el-checkbox>
        </el-text>
      </div>
      <div style="display: flex; gap: 20px">
        <el-checkbox v-model="failedAutoRetry">连接失败后自动重试</el-checkbox>
        <el-input v-model="socketUrl" />
        <el-button type="primary" @click="init">连接执行器</el-button>
      </div>
      <div style="height: 1px; background-color: var(--el-border-color)" />
      <el-text class="title" size="large">
        输出日志
        <el-link
            icon="Delete"
            type="danger"
            style="margin-left: 10px;"
            :underline="false"
            title="清空日志"
            @click="logs = []"
        />
      </el-text>
      <el-scrollbar class="scrollbar">
        <div v-for="(log, i) in logs" :key="i" class="log-item">
          <el-text style="color: #b0b0b0; padding-right: 10px">{{ log.time }}</el-text>
          <el-text :type="log.type"><span v-html="log.msg"></span></el-text>
          <el-button v-if="log.instruct === 'xydxyz'" type="primary" style="margin-left: 10px" @click="yifasong(log)">
            我已发送</el-button
          >
        </div>
        <div id="bottom-log" />
      </el-scrollbar>
    </div>
    <el-dialog
      :title="titleMap[handleType]"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="600px"
    >
      <account-form :handle-type="handleType" :model-value="row" @close="close" @gaimi="handle($event, 'gaimi')" style="height: 400px" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, reactive, type Ref, ref } from 'vue'
import { delGaimiAccountByIds, postSwitchProp, queryGaimiAccountList } from '@/api/gaimi/account'
import { useI18n } from 'vue-i18n'
import AccountForm from '@/views/wangyi/accountForm.vue'
import dayjs from 'dayjs'
import {useSystemStore} from '@/stores/system'

const systemStore = useSystemStore()

let socket = ref<WebSocket>()

const failedAutoRetry = ref(false)

const socketStatus = ref(0)
const enabled = ref(true)
const headless = ref(true)
const minutes = ref()

function save() {
  send('setdsqzt', {
    'enabled':enabled.value,
    'minutes':minutes.value
  })
}

function refresh() {
  send('refresh', {})
}

const statusText = {
  0: { type: 'info', text: '未连接' },
  1: { type: 'success', text: '已连接' },
  2: { type: 'error', text: '已关闭' },
  3: { type: 'danger', text: '正在连接...' }
}

const socketUrl = ref('ws://localhost:8686/gaimi')
function init() {
  if (socket.value) {
    if (socket.value.readyState === WebSocket.CONNECTING) {
      return log('warning', '正在连接中，请耐心等待...')
    } else if (socket.value.readyState === WebSocket.OPEN) {
      return log('warning', '执行器已经连接成功！无需再次连接。')
    } else if (socket.value.readyState === WebSocket.CLOSING) {
      return log('warning', '执行器正在关闭中，请等待关闭后再尝试！')
    }
  }
  if (socket.value) {
    log('info', '正在重新连接执行器...')
  } else {
    log('info', '正在连接执行器...')
  }
  socketStatus.value = 3
  socket.value = new WebSocket(socketUrl.value)
  socket.value.onopen = () => {
    socketStatus.value = 1
    log('success', '执行器连接成功')
    send('token', {
      token: systemStore.token
    })
  }
  socket.value.onclose = onclose
  socket.value.onmessage = onmessage
}

// 发送执行指令
declare type sendInstructType =
  | 'gaimi' //执行改密
  | 'yzsmzt' //已发送实名短信
  | 'destroy' //销毁窗口
  | 'setdsqzt' //设置定时器状态
  | 'refresh' // 手动刷新
  | 'token' // 手动刷新
//
// // 响应执行指令
// declare type responseInstructType =
//   | 'log' //打印日志
//   | 'gmcg' //改密成功
//   | 'xydxyz' //需要短信验证

function send(instruct: sendInstructType, data) {
  if (socketStatus.value !== 1) {
    return log('danger', '执行器未连接，请先连接执行器再操作！')
  }
  socket.value?.send(
    JSON.stringify({
      instruct,
      data
    })
  )
}

function onmessage(e) {
  const socketData: any = JSON.parse(e.data)
  const instruct = socketData.instruct
  const data = socketData.data
  const l = log(data.logType, data.msg)
  // 改密成功
  if (instruct === 'gmcg') {
    postSwitchProp(
      {
        id: data.id,
        username: data.username,
        prop: 'password',
        value: data.newpassword
      },
      {
        showSuccessMsg: true,
        successMsg: `账号 "${data.username}" 新密码已保存！`
      }
    ).then(() => {
      log('primary', `账号 "${data.username}" 新密码已保存！`)
      tableRef.value.fetchQuery()
    })
  }
  // 需要短信验证
  else if (instruct === 'xydxyz') {
    l.id = data.id
    l.remark = data.remark
    l.username = data.username
    l.password = data.password
    l.newpassword = data.newpassword
    l.instruct = instruct
  }
  // 设置执行器初始化信息
  else if (instruct === 'cshxx') {
    enabled.value = data.enabled
    minutes.value = data.minutes
  }
}

function onclose() {
  socketStatus.value = 2
  log('danger', '执行器连接关闭')
  if (failedAutoRetry.value) {
    setTimeout(function () {
      init()
    }, 1000)
  }
}

function log(type: 'primary' | 'info' | 'success' | 'warning' | 'danger', msg: string): any {
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const log = {
    time,
    type,
    msg
  }
  logs.value.push(log)
  if (logs.value.length > 100) logs.value.shift()
  nextTick(() => {
    const dom = document.getElementById('bottom-log')
    dom?.scrollIntoView({
      behavior: 'smooth'
    })
  })
  return log
}

function yifasong(log: any) {
  delete log.instruct
  // 已验证短信
  handle(log, 'yrzsm')
}

const titleMap = {
  add: '账号新增',
  edit: '账号编辑',
  detail: '账号查看',
  gaimi: '账号改密'
}

const logs = ref<any[]>([])

const { t } = useI18n()

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'username', label: '账号' },
  { prop: 'remark', label: '备注' }
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index' },
  { prop: 'username', label: '账号', width: 200 },
  { prop: 'password', label: '登录密码' },
  { prop: 'remark', label: '备注' },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    maxCount: 3,
    buttons: [
      { label: '改密', onClick: (row) => openForm('gaimi', row) },
      { label: t('common.edit'), auth: 'gaimi:account:edit', onClick: (row) => openForm('edit', row) },
      { label: t('common.del'), auth: 'gaimi:account:del', type: 'danger', onClick: (row) => del([row]) },
      { label: '销毁窗口', type: 'warning', onClick: (row) => destroy(row) },
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType | 'job', r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delGaimiAccountByIds(rows.map((i) => i.id).join(','), {
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

function handle(formData: any, flag?: string) {
  formData.newpassword ??= ''
  formData.remark ??= ''
  if (flag === 'yrzsm') {
    log('info', `账号 "${formData.username}" 《${formData.remark}》 已发送短信，继续改密，新密码：${formData.newpassword}`)
  } else if (flag === 'login') {
    log('info', `账号 "${formData.username}" 《${formData.remark}》 开始登录`)
  } else {
    log('info', `账号 "${formData.username}" 《${formData.remark}》 开始执行改密，新密码：${formData.newpassword}`)
  }
  send('gaimi', {
    id: formData.id,
    username: formData.username,
    password: formData.password,
    newpassword: formData.newpassword,
    remark: formData.remark,
    flag,
    headless: headless.value
  })
}

function destroy(formData: any) {
  log('info', `账号 "${formData.username}" 《${formData.remark}》 执行销毁任务。`)

  send('destroy', {
    id: formData.id,
    username: formData.username,
    password: formData.password,
    newpassword: formData.newpassword,
    remark: formData.remark,
  })
}

function login(rows) {
  rows.forEach(i => handle(i, 'login'))
}
</script>
<style lang="scss" scoped>
.root {
  display: flex;
  gap: 10px;

  > div:first-child {
    width: 0;
    flex-grow: 3;
  }

  .console-view {
    width: 0;
    flex-grow: 2;
    background-color: var(--el-bg-color);
    padding: 7px 15px 7px 15px;
    border-radius: 5px;

    display: flex;
    flex-direction: column;

    gap: 10px;

    .title {
      align-self: start;
    }

    .scrollbar {
      flex-grow: 1;

      .log-item {
        padding: 3px 0;
        font-size: 13px;
      }
    }
  }
}
</style>
