<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue'
import { useSystemStore } from '@/stores/system'
import MellowNavTabs from './MellowNavTabs.vue'
import SquareNavTabs from './SquareNavTabs.vue'
import LivelyNavTabs from './LivelyNavTabs.vue'
import { useRoute } from 'vue-router'
import { type ContextMenuItem, showContextMenu } from '@/utils/context-menu'

const systemStore = useSystemStore()
const route = useRoute()

const tabStyleComp = {
  mellow: MellowNavTabs,
  square: SquareNavTabs,
  lively: LivelyNavTabs
}

const currentIndex = ref<number>(0)
const navTabs = systemStore.navTabs

const navTabsRef = ref()

/**
 * 根据fullPath移除一个导航tab
 * @param fullPath
 */
function removeTab(fullPath: string) {
  systemStore.removeNavTabByFullPath(fullPath)
}

/**
 * 右击触发菜单项
 */
function onContextmenu(e: PointerEvent, index: number) {
  currentIndex.value = index
  const menus: ContextMenuItem[] = [
    {
      label: '重新加载',
      icon: 'Refresh',
      disabled: navTabs[currentIndex.value]?.fullPath !== route.fullPath
    },
    {
      label: '关闭此页签',
      icon: 'close',
      disabled: navTabs.length < 2,
      type: 'default'
    },
    { label: '关闭其他页签', icon: 'Minus', disabled: navTabs.length < 2 },
    {
      label: '关闭左侧页签',
      icon: 'ArrowLeft',
      disabled: currentIndex.value === 0
    },
    {
      label: '关闭右侧页签',
      icon: 'ArrowRight',
      disabled: currentIndex.value === navTabs.length - 1
    }
  ]
  showContextMenu({
    clientX: e.clientX,
    clientY: e.clientY,
    menus,
    onClick: clickMenu
  })
}

function clickMenu(menu: ContextMenuItem) {
  if (menu.label === '重新加载') {
    systemStore.setRefresh(true)
  } else if (menu.label === '关闭此页签') {
    systemStore.removeNavTabByIndex(currentIndex.value)
  } else {
    navTabs
      .filter((i, index) => {
        if (menu.label === '关闭其他页签') return index !== currentIndex.value
        if (menu.label === '关闭左侧页签') return index < currentIndex.value
        if (menu.label === '关闭右侧页签') return index > currentIndex.value
        return false
      })
      .map((i) => i.fullPath)
      .forEach(removeTab)
  }
}

/**
 * 当前菜单变化或者增加菜单项需将当前菜单页签滚动至可视区域
 */
watch(
  () => [route.fullPath, navTabs.length],
  () => {
    nextTick(() => {
      const dom = navTabsRef.value.getElementsByClassName('active-tab').item(0)
      dom?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      })
    })
  }
)

provide('navTab', {
  removeTab,
  onContextmenu
})
</script>

<template>
  <div ref="navTabsRef" class="nav-tabs-view" v-if="!systemStore.layout.heightShrink">
    <component :is="tabStyleComp[systemStore.layout.tabStyle]" />
  </div>
</template>

<style scoped lang="scss">
.nav-tabs-view {
  padding: 0 10px;
}

:deep(.el-scrollbar__bar) {
  display: none;
}
</style>
