<template>
  <div>
    <el-button type="primary" @click="req1">请求</el-button>
    <el-button type="primary" @click="req2">定制确认弹框按钮文字信息</el-button>
  </div>
</template>

<script setup lang="ts">
import createAxios from '@/utils/request'
import MockAdapter from 'axios-mock-adapter'

// 模拟请求数据
function mock(axios) {
  const mock = new MockAdapter(axios)
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-success`).reply(200, {
    httpCode: 200,
    status: 'success',
    message: 'ok',
    data: [{ id: 1, name: 'John Smith' }]
  })
}

function req1() {
  const axios = createAxios({
    showBeforeConfirm: true,
    showSuccessMsg: true,
    successMsg: '删除成功'
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    console.info(res)
  })
}

function req2() {
  const axios = createAxios({
    showBeforeConfirm: true,
    confirmMsg: '确认要删除此项吗？',
    confirmButtonText: '确认删除',
    showSuccessMsg: true,
    successMsg: (res) => '删除成功：' + JSON.stringify(res.data)
  })
  mock(axios)
  axios.post('/api/mock-success').then((res) => {
    console.info(res)
  })
}
</script>
