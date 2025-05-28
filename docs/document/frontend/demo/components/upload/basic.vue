<template>
  <div class="el-text">
    上传文件
    <MUpload ref="upRef1" :limit="3" v-model="file1" tip="可上传任何文件" />
    不允许从文件库选择
    <MUpload :limit="3" :select-from-lib="false" v-model="file1" />
    <br />
    上传图片
    <MUpload ref="upRef2" type="upload-img" :limit="3" v-model="file2" />
    <br />
    上传图片，不允许从文件库选择
    <MUpload type="upload-img" :select-from-lib="false" list-type="picture" v-model="file2" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const file1 = ref()
const file2 = ref()
</script>
