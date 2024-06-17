<script setup lang="ts">
import Logo from '@/layout/Logo.vue'
import Menu from '@/layout/Menu.vue'
import Header from '@/layout/Header.vue'
import Main from '@/layout/Main.vue'
import Footer from '@/layout/Footer.vue'
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
  <div class="layout" :class="`${systemStore.layout.widthShrink ? 'layout-width-shrink' : ''}`">
    <div class="left-aside" :style="{ width: sideWidth }">
      <Logo v-if="systemStore.layout.showLogo" class="logo" />
      <Menu class="menu" />
    </div>
    <div class="right-side">
      <Header class="header" />
      <Main class="main" />
      <Footer v-if="systemStore.layout.showFooter" class="footer" />
      <transition name="el-fade-in" mode="out-in">
        <div
          v-if="systemStore.layout.widthShrink && !systemStore.layout.menuCollapse"
          class="mock-view"
          @click.stop="systemStore.layout.menuCollapse = true"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  height: 100%;
  display: flex;
  background-color: var(--layout-bg-color);

  .left-aside {
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color-extra-light);
    background-color: var(--layout-left-bg-color);

    .menu {
      height: 0;
      flex: 1;
    }
  }

  .right-side {
    width: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .header {
      background-color: var(--layout-header-bg-color);
    }

    .main {
      height: 0;
      flex-grow: 1;
      padding: 10px;
    }

    .footer {
      padding-bottom: 10px;
    }
  }
}

.layout-width-shrink {
  .left-aside {
    z-index: 2002;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .mock-view {
    z-index: 2001;
    position: absolute;
    inset: 0;
    background-color: var(--el-overlay-color-lighter);
  }
}
</style>
