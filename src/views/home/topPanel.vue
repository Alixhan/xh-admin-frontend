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
        <el-link type="primary">github</el-link>&nbsp; <br />
        官网文档地址：
        <el-link type="primary" @click="open('http://www.xhansky.cn')">https://www.xhansky.cn</el-link>&nbsp;
      </el-text>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/stores/system'
import { ElMessageBox } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'

const systemStore = useSystemStore()

const star = useLocalStorage('star', {
  isStar: false,
  time: 0
})

toStar()

function toStar() {
  if (!star.value.isStar) {
    if (star.value.time) {
      const time = new Date().getTime()
      const days = (time - star.value.time) / (24 * 60 * 60 * 1000)
      if (days < 10) return
    }
    setTimeout(() => {
      ElMessageBox.confirm('觉得不错的话，可以帮忙给开源代码仓库点个 star 小⭐⭐吗？你的 star 是作者的前进的动力！', '小小请求', {
        confirmButtonText: '马上去',
        cancelButtonText: '我就不！',
        closeOnClickModal: false
      })
        .then(() => {
          open('https://gitee.com/sun-xiaohan/xh-admin-frontend')
          star.value.isStar = true
        })
        .catch(() => {
          star.value.time = new Date().getTime()
        })
    }, 120000)
  }
}

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
