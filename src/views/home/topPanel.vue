<template>
  <div>
    <div class="greeting-view">早上好，{{ systemStore.user.name }}!</div>
    <div class="description-view">
      <el-text>
        前后端分离的开源管理系统，最新技术栈开发。
        <el-tag>完全开源免费</el-tag><br>

        如果觉得不错的话，点个 star ❤️，给点支持鼓励🌹。代码仓库：
        <el-link type="primary">gitee</el-link>&nbsp;
        <el-link type="primary">github</el-link>&nbsp;，
        官网文档地址：
        <el-link type="primary" @click="open('http://www.xhansky.cn')">https://www.xhansky.cn</el-link>&nbsp;，
      </el-text>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useSystemStore} from '@/stores/system'

const systemStore = useSystemStore()

function open(url: string) {
  window.open(url)
}
</script>
<style lang="scss" scoped>
.greeting-view {
  padding-bottom: 10px;
  font-weight: bold;
}

.description-view {
  line-height: 25px;
}
</style>
