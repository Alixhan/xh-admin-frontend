<template>
  <el-button type="primary" @click="download">下载</el-button>
  <el-button type="primary" @click="preview">预览</el-button>
</template>

<script setup lang="ts">
import { getDownloadFileUrl } from '@/utils'

function download() {
  window.open(getDownloadFileUrl({ id: 1, disposition: 'attachment', fileName: '我要抱抱.gif' }))
}

function preview() {
  window.open(getDownloadFileUrl({ id: 1, disposition: 'inline' }))
}
</script>
