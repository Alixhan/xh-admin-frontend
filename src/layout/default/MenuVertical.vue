<template>
  <el-menu
    class="el-menu"
    :collapse-transition="false"
    :default-active="systemStore.activeMenuId + ''"
    :collapse="systemStore.layout.menuCollapse"
    @select="select"
  >
    <MenuItem v-for="menu in systemStore.treeMenus" :key="menu.id" :menu="menu" />
  </el-menu>
</template>

<script setup>
import { useSystemStore } from '@/stores/system'
import MenuItem from '@/layout/default/MenuItem.vue'

const systemStore = useSystemStore()

function select (index) {
  const menu = systemStore.menus.find((i) => i.id === Number(index))
  if (menu.handleType === 'outer') {
    window.open(menu.outerUrl)
  } else {
    systemStore.setActiveMenuId(Number(index))
  }
}
</script>
<style scoped lang="scss">
.el-menu {
  width: 100%;
}
</style>
