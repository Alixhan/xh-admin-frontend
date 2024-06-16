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
        <m-icon v-if="systemStore.layout.showNavTabIcon && tab.icon" class="tab-icon" :model-value="tab.icon" />
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
import { inject, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const navTabs = systemStore.navTabs

const navTab = inject('navTab')

/**
 * 当前菜单变化或者增加菜单项需将当前菜单页签滚动至可视区域
 */
watch(
  () => [route.fullPath, navTabs.length],
  () => {
    nextTick(() => {
      const dom = document.getElementsByClassName('active-tab').item(0)
      dom?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      })
    })
  }
)
</script>
<style scoped lang="scss">
$transition-time: all 0.2s linear;

.nav-tabs {
  padding: 0 0 10px 0;
  height: auto;
  display: inline-flex;
  gap: 10px;
  font-size: var(--el-font-size-base);

  .tab-item {
    box-sizing: border-box;
    user-select: none;
    position: relative;
    display: inline-flex;
    border: var(--el-border);
    border-radius: 3px;
    align-items: center;
    padding: 7px 15px;
    line-height: 1em;
    transition: $transition-time;
    cursor: pointer;

    .tab-icon {
      margin-right: 0.5em;
    }

    .tab-title {
      margin-right: 5px;
      white-space: nowrap;
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
  }

  .tab-item:hover,
  .active-tab {
    color: var(--el-color-primary);
    //box-shadow: var(--el-box-shadow);
    border-color: var(--el-color-primary);
  }
}
</style>
