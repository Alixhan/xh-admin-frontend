<template>
  <div class="action-view">
    <Github class="action-item" />
    <FullScreenControl class="action-item" />
    <SwitchStyle class="action-item" />
    <SwitchLocale class="action-item" />
    <UserAvatar class="action-item" />
    <Setting class="action-item" />
  </div>
</template>
<script setup>
import Github from './Github.vue'
import FullScreenControl from './FullScreenControl.vue'
import UserAvatar from './UserAvatar.vue'
import SwitchStyle from './SwitchStyle.vue'
import Setting from './Setting.vue'
import SwitchLocale from './SwitchLocale.vue'
defineOptions({
  name: 'DefaultLayout'
})
</script>
<style scoped lang="scss">
.action-view {
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: var(--el-border-radius-base);

  .action-item {
    min-width: 16px;
    height: 30px;
    padding: 0 8px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .action-item:hover {
    background-color: var(--el-color-primary-light-9);

    :deep(svg) {
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
  0%,
  20%,
  40%,
  60%,
  80%,
  100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 1;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.4, 1.4, 1.4);
  }
  40% {
    opacity: 1;
    transform: scale3d(0.7, 0.7, 0.7);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.1, 1.1, 1.1);
  }
  80% {
    transform: scale3d(0.87, 0.87, 0.87);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
</style>
