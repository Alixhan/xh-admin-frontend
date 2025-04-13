<template>
  <m-svg-icon @click="open" class="icon-style" src="@/assets/icon/github.svg" inherited />
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
import { h } from 'vue'

defineOptions({
  name: 'ActionGithub'
})

function open() {
  ElMessageBox({
    title: '代码仓库',
    message: h('p', null, [
      h('div', '欢迎 star'),
      h('a', { href: 'https://github.com/Alixhan/xh-admin-frontend', target: '_blank' }, 'github前端代码库'),
      h('span', '、'),
      h('a', { href: 'https://github.com/Alixhan/xh-admin-backend', target: '_blank' }, 'github后端代码库'),
      h('div'),
      h('a', { href: 'https://gitee.com/sun-xiaohan/xh-admin-frontend', target: '_blank' }, 'gitee前端代码库'),
      h('span', '、'),
      h('a', { href: 'https://gitee.com/sun-xiaohan/xh-admin-backend', target: '_blank' }, 'gitee后端代码库'),
      h('div'),
      h('a', { href: 'https://www.xhansky.cn/', target: '_blank' }, '官方文档')
    ])
  })
}
</script>
<style scoped lang="scss">
.icon-style {
  width: 18px;
  height: 18px;
}
</style>
