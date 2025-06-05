<script setup lang="ts">
import Footer from '@/layout/Footer.vue'
import Header from '@/layout/Header.vue'
import Main from '@/layout/Main.vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
</script>

<template>
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
</template>

<style scoped lang="scss">
.right-side {
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

.width-shrink-layout {
  .mock-view {
    z-index: 2001;
    position: absolute;
    inset: 0;
    background-color: var(--el-overlay-color-lighter);
  }
}
</style>
