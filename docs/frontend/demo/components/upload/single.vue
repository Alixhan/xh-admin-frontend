<template>
  <div class="el-text">
    上传单个图片，single 为 object，model-value: {{ file1 }}
    <MUpload type="upload-img" single="object" v-model="file1" />
    <br />
    上传单个图片，single 为 id，model-value: {{ file2 }}
    <MUpload type="upload-img" single="id" v-model="file2" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const file1 = ref()
const file2 = ref()
</script>
