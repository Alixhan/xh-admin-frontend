<template>
  <div>
    <el-button type="primary" @click="req1">请求成功</el-button>
    <el-button type="primary" @click="req2">定制成功的提示</el-button>
    <el-button type="primary" @click="req3">根据响应内容提示</el-button>
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
    showSuccessMsg: true
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    console.info(res)
  })
}

function req2() {
  const axios = createAxios({
    showSuccessMsg: true,
    successMsg: '保存成功了'
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    console.info(res)
  })
}

function req3() {
  const axios = createAxios({
    showSuccessMsg: true,
    successMsg: (res) => '请求成功：' + JSON.stringify(res.data)
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    console.info(res)
  })
}
</script>
