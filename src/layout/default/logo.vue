<template>
  <div class="logo-view">
    <img class="logo-img" src="/favicon.ico" />
    <transition :name="systemStore.layout.mainAnimation" mode="out-in">
      <div v-show="!systemStore.layout.menuCollapse" class="logo-text">
        {{ projectTitle }}
      </div>
    </transition>
  </div>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const projectTitle = import.meta.env.VITE_TITLE
</script>
<style scoped lang="scss">
.logo-view {
  padding: 15px;
  display: flex;
  align-items: center;
  font-size: 15px;
  border-bottom: var(--el-border);

  .logo-img {
    flex-shrink: 0;
    width: 30px;
    height: auto;
    color: var(--el-color-primary);
  }

  .logo-text {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s linear;
    padding-left: 10px;
  }
}
</style>
