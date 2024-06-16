<script setup lang="ts">
import { provide, ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import MellowNavTabs from './MellowNavTabs.vue'
import SquareNavTabs from './SquareNavTabs.vue'
import ContextMenu, { type ContextMenuItem } from '@/components/ContextMenu.vue'
import { useRoute } from 'vue-router'

const systemStore = useSystemStore()
const route = useRoute()

const tabStyleComp = {
  mellow: MellowNavTabs,
  square: SquareNavTabs
}

const currentIndex = ref<number>(0)
const navTabs = systemStore.navTabs

const contextMenuRef = ref()

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
  const menus = [
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
  contextMenuRef.value.show(e, menus)
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

provide('navTab', {
  removeTab,
  onContextmenu
})
</script>

<template>
  <div class="nav-tabs-view">
    <component :is="tabStyleComp[systemStore.layout.tabStyle]" />
  </div>
  <ContextMenu ref="contextMenuRef" @click="clickMenu" />
</template>

<style scoped lang="scss">
.nav-tabs-view {
  padding: 0 10px;
}
</style>
