<template>
  <el-scrollbar>
    <div class="nav-tabs">
      <el-text
        v-for="(tab, index) in navTabs"
        :key="index"
        @contextmenu.prevent="navTab.onContextmenu($event, index)"
        @click="router.push(tab.fullPath)"
        :class="{
          'active-tab': route.fullPath === tab.fullPath,
          'disable-tab': navTabs.length < 2
        }"
        class="tab-item"
      >
        <m-icon v-if="systemStore.layout.showNavTabIcon && tab.icon" class="tab-icon" :value="tab.icon" />
        <div class="tab-title">{{ tab.title }}</div>
        <el-icon class="close-icon" size="12">
          <Close @click.stop="navTab.removeTab(tab.fullPath)" />
        </el-icon>
      </el-text>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const navTabs = systemStore.navTabs

const navTab = inject('navTab')
</script>
<style scoped lang="scss">
$transition-time: all 0.2s ease;

.nav-tabs {
  height: auto;
  display: inline-flex;
  gap: 5px;
  padding: 0 12px;
  font-size: var(--el-font-size-base);

  .tab-item {
    box-sizing: border-box;
    user-select: none;
    position: relative;
    display: inline-flex;
    border-radius: 10px 10px 0 0;
    align-items: center;
    padding: 10px 15px;
    line-height: 1em;
    transition: $transition-time;
    cursor: pointer;

    .tab-icon {
      margin-right: 0.5em;
    }

    .tab-title {
      margin-right: 5px;
      white-space: nowrap;
      transition: $transition-time;
    }

    .close-icon {
      transition: $transition-time;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0;
      height: 0;

      &:hover {
        background-color: gray;
        color: white;
      }
    }

    &:hover:not(.disable-tab) {
      padding-left: 9px;
      padding-right: 9px;

      .close-icon {
        width: 12px;
        height: 12px;
      }
    }

    &::before,
    &::after {
      transition: $transition-time;
      content: '';
      position: absolute;
      width: 15px;
      height: 15px;
      bottom: 0;
    }
  }

  .tab-item:hover,
  .active-tab {
    color: var(--el-color-primary-dark-2);
    background-color: var(--el-bg-color-page);
    //font-weight: bold;

    &::before {
      background: radial-gradient(circle at 0 0, transparent 15px, var(--el-bg-color-page) 15px);
      left: -15px;
    }

    &::after {
      background: radial-gradient(circle at 15px 0, transparent 15px, var(--el-bg-color-page) 15px);
      right: -15px;
    }
  }
}
</style>
