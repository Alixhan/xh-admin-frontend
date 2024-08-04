<template>
  <div>
    <el-button type="primary" icon="check" @click="req1" :loading="loadingRef">请求</el-button>
  </div>
</template>

<script setup lang="ts">
import createAxios from '@/utils/request'
import { ElNotification } from 'element-plus'
import MockAdapter from 'axios-mock-adapter'
import { ref } from 'vue'

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

const loadingRef = ref()

function req1() {
  const axios = createAxios({
    loadingRef
  })
  mock(axios)
  axios.get('/api/mock-success').then((res) => {
    ElNotification.success('请求成功：' + JSON.stringify(res.data))
  })
}
</script>
