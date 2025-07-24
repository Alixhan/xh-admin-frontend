<template>
  <div>
    <el-text>
      <div class="greeting-view">你好，{{ systemStore.user.name }}!</div>
    </el-text>
    <div class="description-view">
      <el-text>
        前后端分离的开源管理系统，最新技术栈开发。
        <!--        <el-tag>完全开源免费</el-tag>-->
        <br />

        如果觉得不错的话，点个
        <el-link type="primary" @click="open('https://gitee.com/sun-xiaohan/xh-admin-frontend')">star</el-link>&nbsp;
        ❤️，给点支持鼓励🌹。代码仓库：
        <el-link type="primary" @click="open('https://gitee.com/sun-xiaohan/xh-admin-frontend')">gitee</el-link>&nbsp;
        <el-link type="primary" @click="open('https://github.com/Alixhan/xh-admin-frontend')">github</el-link>&nbsp;
        <br />
        官网文档地址：
        <el-link type="primary" @click="open('http://www.xhansky.cn')">https://www.xhansky.cn</el-link>&nbsp;
      </el-text>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

function open(url: string) {
  globalThis.open(url)
}
</script>
<style lang="scss" scoped>
.greeting-view {
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 1.2em;
}

.description-view {
  line-height: 25px;
}
</style>
