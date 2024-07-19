<template>
  <div class="el-text">
    <el-button type="primary" @click="upRef1.upload()" style="margin-bottom: 10px;">上传至服务器</el-button>
    <MUpload ref="upRef1" v-model="file1" tip="tip提示" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const file1 = ref()
const upRef1 = ref()
</script>
