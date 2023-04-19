<template>
  <div class="action-view">
    <FullScreenControl class="action-item"/>
    <SwitchStyle class="action-item"/>
    <UserAvatar class="action-item"/>
  </div>
</template>
<script setup>
import FullScreenControl from '@/layout/default/action/fullScreenControl.vue'
import UserAvatar from '@/layout/default/action/userAvatar.vue'
import SwitchStyle from '@/layout/default/action/switchStyle.vue'
</script>
<style scoped lang="scss">
.action-view {
  display: flex;
  align-items: stretch;
  height: 45px;

  border-radius: 5px;

  .action-item {
    height: 45px;
    padding: 0 15px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    border-right: 1px solid var(--el-border-color);
  }

  .action-item:last-child {
    border-right: none;
  }

  .action-item:hover {
    background-color: var(--el-color-primary-light-9);
    :deep(>svg){
      animation: bounceIn 0.5s linear forwards;
    }
  }

  .action-item:first-child:hover {
    border-radius: 5px 0 0 5px;
  }

  .action-item:last-child:hover {
    border-radius: 0 5px 5px 0;
  }
}
</style>
