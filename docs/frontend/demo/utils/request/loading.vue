<template>
  <div>
    <el-button type="primary" @click="req1">请求</el-button>
    <el-button type="primary" @click="req2">加载中文字</el-button>
  </div>
</template>

<script setup lang="ts">
import createAxios from '@/utils/request'
import { ElNotification } from 'element-plus'
import MockAdapter from 'axios-mock-adapter'

// 模拟请求数据
function mock(axios) {
  const mock = new MockAdapter(axios, { delayResponse: 2000 })
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-success`).reply(200, {
    httpCode: 200,
    status: 'success',
    message: 'ok',
    data: [{ id: 1, name: 'John Smith' }]
  })
  mock.onAny(`${import.meta.env.VITE_BASE_URL}/api/mock-error`).reply(500)
}

function req1() {
  const axios = createAxios({
    showLoading: true
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    ElNotification.success('请求成功：' + JSON.stringify(res.data))
  })
}

function req2() {
  const axios = createAxios({
    showLoading: true,
    loadingText: '加载中文字...'
  })
  mock(axios)
  axios.get('/api/mock-error')
}
</script>
