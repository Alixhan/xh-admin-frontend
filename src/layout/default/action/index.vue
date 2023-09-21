<template>
  <div class="action-view">
    <FullScreenControl class="action-item" />
    <SwitchStyle class="action-item" />
    <UserAvatar class="action-item" />
    <Setting class="action-item" />
  </div>
</template>
<script setup>
import FullScreenControl from '@/layout/default/action/fullScreenControl.vue'
import UserAvatar from '@/layout/default/action/userAvatar.vue'
import SwitchStyle from '@/layout/default/action/switchStyle.vue'
import Setting from '@/layout/default/action/setting.vue'
</script>
<style scoped lang="scss">
.action-view {
  display: flex;
  align-items: center;
  height: 30px;

  border-radius: var(--el-border-radius-base);

  .action-item {
    height: 30px;
    padding: 0 10px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .action-item:hover {
    background-color: var(--el-color-primary-light-9);

    :deep(> svg) {
      animation: bounce-in 0.5s linear forwards;
    }
  }

  .action-item:first-child:hover {
    border-radius: 5px 0 0 5px;
  }

  .action-item:last-child:hover {
    border-radius: 0 5px 5px 0;
  }
}

@keyframes bounce-in {
  0%, 20%, 40%, 60%, 80%, 100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 1;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    -webkit-transform: scale3d(1.4, 1.4, 1.4);
    transform: scale3d(1.4, 1.4, 1.4);
  }
  40% {
    opacity: 1;
    -webkit-transform: scale3d(0.7, 0.7, 0.7);
    transform: scale3d(0.7, 0.7, 0.7);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }
  80% {
    -webkit-transform: scale3d(0.87, 0.87, 0.87);
    transform: scale3d(0.87, 0.87, 0.87);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
</style>
