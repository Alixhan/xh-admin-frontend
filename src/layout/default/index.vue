<template>
  <div
    class="default-root-view"
    :class="{
      'menu-expand': !systemStore.layout.menuCollapse
    }"
  >
    <div class="left-view">
      <Logo class="logo" />
      <Menu class="menu" />
    </div>
    <div class="right-view">
      <Header class="header" />
      <Main class="main" />
      <transition name="el-fade-in" mode="out-in">
        <div v-if="!systemStore.layout.menuCollapse" class="mock-view" @click.stop="systemStore.layout.menuCollapse = true" />
      </transition>
    </div>
  </div>
</template>
<script setup>
import Logo from './logo'
import Menu from './menu'
import Main from '@/layout/main'
import Header from './header'
import { computed } from 'vue'
import { useSystemStore } from '@/stores/system'

/**
 * 默认布局
 */

defineOptions({
  name: 'defaultLayout'
})

const systemStore = useSystemStore()
const menuWidth = computed(() => systemStore.layout.menuWidth + 'px')
</script>
<style scoped lang="scss">
$transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
.default-root-view {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  backdrop-filter: blur(10px);
  background-color: var(--layout-bg-color);

  .left-view {
    overflow: hidden;
    transition: $transition;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 66px;
    border-right: 1px solid var(--el-border-color-extra-light);
    background-color: var(--layout-left-bg-color);

    .menu {
      flex-grow: 1;
    }
  }

  .right-view {
    position: relative;
    width: 0;
    margin-left: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .header {
      background-color: var(--layout-header-bg-color);
    }

    .main {
      padding: 10px;
      flex-grow: 1;
      height: 0;
    }
  }
}

.width-shrink-layout {
  .left-view {
    background-color: var(--el-bg-color);
    z-index: 100;
    width: 0;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .mock-view {
    z-index: 3;
    position: absolute;
    inset: 0;
    background-color: var(--el-overlay-color-lighter);
  }
}

.menu-expand {
  .left-view {
    width: v-bind(menuWidth);
  }
}
</style>
