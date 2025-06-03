<script setup lang="ts">
import LeftSide from './LeftSide.vue'
import RightSide from './RightSide.vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
</script>

<template>
  <div class="layout" :class="`${systemStore.layout.widthShrink ? 'layout-width-shrink' : ''}`">
    <LeftSide class="left-side" />
    <RightSide class="right-side" />
  </div>
</template>

<style scoped lang="scss">
.layout {
  height: 100%;
  display: flex;
  background-color: var(--layout-bg-color);

  .right-side {
    width: 0;
    flex-grow: 1;
  }
}
</style>
