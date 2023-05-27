<template>
  <el-scrollbar style="padding-bottom: 10px; margin-bottom: -10px; --el-popover-padding: 0px">
    <div class="nav-tabs">
      <div
        v-for="(tab, index) in navTabs"
        :key="index"
        @contextmenu.prevent="onContextmenu(index)"
        @click="systemStore.activeMenuId = tab.id"
        :class="{
          'active-tab': systemStore.activeMenuId === tab.id,
          'disable-tab': navTabs.length < 2
        }"
        class="tab-item"
      >
        <div class="trigger-view" :ref="(e) => (tabRefs[index] = e)" @click.stop />
        <div class="tab-title">{{ tab.title }}</div>
        <el-icon class="tab-icon" size="12">
          <Close @click.stop="removeTab(tab.id)" />
        </el-icon>
      </div>
    </div>
    <el-popover
      style="padding: 0"
      :virtual-ref="virtualRef"
      trigger="click"
      virtual-triggering
      :hide-after="0"
      popper-style="padding: 0; width: auto; min-width: auto;"
      v-model:visible="visible"
    >
      <div class="menu-view">
        <el-link
          v-for="(menu, i) in menuItems"
          class="menu-item"
          :class="{ 'disable-menu': menu.disabled }"
          :key="i"
          v-bind="menu"
          @click="clickMenu(menu)"
          :underline="false"
        >
          {{ menu.label }}
        </el-link>
      </div>
    </el-popover>
  </el-scrollbar>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { nextTick, ref, watch, watchEffect } from 'vue'

const systemStore = useSystemStore()
const navTabs = systemStore.navTabs
const visible = ref(false)
const virtualRef = ref()
const tabRefs = ref([])
const currentIndex = ref()
const menuItems = ref()
watchEffect(initMenuItems)

function initMenuItems () {
  menuItems.value = [
    {
      label: '重新加载',
      icon: 'Refresh',
      disabled: navTabs[currentIndex.value]?.id !== systemStore.activeMenuId
    },
    { label: '关闭此页签', icon: 'close', disabled: navTabs.length < 2, type: 'default' },
    { label: '关闭其他页签', icon: 'Minus', disabled: navTabs.length < 2 },
    { label: '关闭左侧页签', icon: 'ArrowLeft', disabled: currentIndex.value === 0 },
    {
      label: '关闭右侧页签',
      icon: 'ArrowRight',
      disabled: currentIndex.value === navTabs.length - 1
    }
  ]
}

/**
 * 当前菜单变化或者增加菜单项需将当前菜单页签滚动至可视区域
 */
watch(
  () => [systemStore.activeMenuId, navTabs.length],
  () => {
    nextTick(() => {
      const dom = document.getElementsByClassName('active-tab').item(0)
      dom?.scrollIntoView({
        behavior: 'smooth'
      })
    })
  }
)

/**
 * 根据menuId移除一个导航tab
 * @param menuId
 */
function removeTab (menuId) {
  systemStore.removeNavTabByMenuId(menuId)
  tabRefs.value.pop()
}

/**
 * 右击触发菜单项
 */
function onContextmenu (index) {
  virtualRef.value = tabRefs.value[index]
  nextTick(() => {
    if (!visible.value) virtualRef.value.click()
  })
  currentIndex.value = index
}

function clickMenu (menu) {
  virtualRef.value.click()
  if (menu.label === '重新加载') {
    systemStore.setRefresh(true)
  } else if (menu.label === '关闭此页签') {
    removeTab(navTabs[currentIndex.value].id)
  } else {
    navTabs
      .filter((i, index) => {
        if (menu.label === '关闭其他页签') return index !== currentIndex.value
        if (menu.label === '关闭左侧页签') return index < currentIndex.value
        if (menu.label === '关闭右侧页签') return index > currentIndex.value
        return false
      })
      .map((i) => i.id)
      .forEach(removeTab)
  }
}
</script>
<style scoped lang="scss">
$transition-time: all 0.3s linear;

.nav-tabs {
  height: auto;
  display: flex;
  gap: 10px;
  font-size: var(--el-font-size-base);

  .tab-item {
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

    .tab-title {
      margin-right: 5px;
      white-space: nowrap;
    }

    .tab-icon {
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

      .tab-icon {
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

.trigger-view {
  position: absolute;
  left: 50%;
  top: 80%;
}

.menu-view {
  padding: 5px 0;
  display: flex;
  flex-direction: column;

  .menu-item {
    padding: 5px 10px;
    justify-content: flex-start;
    display: inline-flex;

    &:hover:not(.disable-menu) {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}
</style>
