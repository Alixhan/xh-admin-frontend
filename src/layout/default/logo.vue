<template>
  <div class="logo-view">
    <m-svg-icon class="logo-img" :src="systemStore.layout.isDark ? logoWhite : logoBlack" />
    <transition :name="systemStore.layout.mainAnimation" mode="out-in">
      <div v-show="!systemStore.layout.menuCollapse" class="logo-text">
        {{ projectTitle }}
      </div>
    </transition>
  </div>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import logoBlack from '@/assets/icon/logo-black.svg'
import logoWhite from '@/assets/icon/logo-white.svg'

const systemStore = useSystemStore()

const projectTitle = import.meta.env.VITE_TITLE
</script>
<style scoped lang="scss">
.logo-view {
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 15px;

  .logo-img {
    flex-shrink: 0;
    width: 40px;
    height: auto;
    color: var(--el-color-primary);
  }

  .logo-text {
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s linear;
    padding-left: 10px;
  }
}
</style>
