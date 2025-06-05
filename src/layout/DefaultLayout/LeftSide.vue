<script setup lang="ts">
import Logo from '@/layout/Logo.vue'
import Menu from '@/layout/Menu.vue'
import { computed } from 'vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const sideWidth = computed(() => {
  if (!systemStore.layout.menuCollapse) return systemStore.layout.menuWidth + 'px'
  if (systemStore.layout.widthShrink) return '0'
  return '66px'
})
</script>

<template>
  <div class="left-side" :style="{ width: sideWidth }">
    <Logo v-if="systemStore.layout.showLogo" class="logo" />
    <Menu class="menu" />
  </div>
</template>

<style scoped lang="scss">
.left-side {
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color-extra-light);
  background-color: var(--el-menu-bg-color);
  color: var(--el-menu-text-color);

  .menu {
    height: 0;
    flex: 1;
  }
}

.width-shrink-layout {
  .left-side {
    z-index: 2002;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    border-right: none;
  }
}
</style>
