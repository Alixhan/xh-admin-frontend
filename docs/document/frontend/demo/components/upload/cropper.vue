<template>
  <div class="el-text">
    基础裁剪：
    <MUpload type="upload-img" :limit="3" :cropper="cropperOption1" v-model="file1" />
    <br />
    固定宽高比：
    <MUpload type="upload-img" :limit="3" :cropper="cropperOption2" v-model="file2" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const cropperOption1 = {}
const cropperOption2 = {
  fixed: true,
  fixedNumber: [1, 1]
}

const file1 = ref()
const file2 = ref()
</script>
