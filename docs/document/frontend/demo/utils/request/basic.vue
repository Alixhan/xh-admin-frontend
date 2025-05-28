<template>
  <div>
    <el-button type="primary" @click="req1">请求成功</el-button>
    <el-button type="primary" @click="req2">请求失败</el-button>
    <el-button type="primary" @click="req3">业务警告</el-button>
    <el-button type="primary" @click="req4">后台错误信息</el-button>
  </div>
</template>

<script setup lang="ts">
import createAxios from '@/utils/request'
import { ElNotification } from 'element-plus'
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
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-error`).reply(500)
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-warning`).reply(200, {
    httpCode: 200,
    status: 'warning',
    message: '这是一个警告信息'
  })
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-error2`).reply(200, {
    httpCode: 200,
    status: 'error',
    message: '这个是一个业务错误'
  })
}

function req1() {
  const axios = createAxios()
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    ElNotification.success('请求成功：' + JSON.stringify(res.data))
  })
}

function req2() {
  const axios = createAxios()
  mock(axios)
  axios.get('/api/mock-error')
}

function req3() {
  const axios = createAxios()
  mock(axios)
  axios.get('/api/mock-warning')
}

function req4() {
  const axios = createAxios()
  mock(axios)
  axios.get('/api/mock-error2')
}
</script>
