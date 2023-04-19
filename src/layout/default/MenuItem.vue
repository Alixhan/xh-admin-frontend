<template>
  <el-sub-menu v-if="children.length" :index="index">
    <template #title>
      <m-icon v-if="props.menu.icon" :model-value="props.menu.icon"/>
      <span>{{ props.menu.title }}</span>
    </template>
    <menu-item v-for="(menu, key) in children" :key="key" :menu="menu"/>
  </el-sub-menu>
  <el-menu-item v-else :index="index">
    <m-icon v-if="props.menu.icon" :model-value="props.menu.icon"/>
    <span>{{ menu.title }}</span>
  </el-menu-item>
</template>

<script setup>
const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})
// 子项包含目录和菜单才视为菜单目录
const children = props.menu.children?.filter(i => ['dir', 'menu'].includes(i.type)) ?? []
const index = props.menu.id + ''
</script>
