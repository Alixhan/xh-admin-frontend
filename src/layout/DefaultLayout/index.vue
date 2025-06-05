<script setup lang="ts">
import LeftSide from './LeftSide.vue'
import RightSide from './RightSide.vue'
</script>

<template>
  <div class="layout">
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
