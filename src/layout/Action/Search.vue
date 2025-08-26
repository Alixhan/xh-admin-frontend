<template>
  <m-icon v-if="systemStore.layout.widthShrink" value="el|search" class="action-item" @click="openSearch" />
  <div v-else class="search-view" @click="openSearch">
    <div class="search-btn el-text">
      <m-svg-icon src="/icon/search.svg" class="m-icon" />
      <span>{{ $t('common.search') }}</span>
      <div class="ck">Ctrl K</div>
    </div>
  </div>
  <el-dialog
    v-model="visible"
    :show-close="false"
    style="min-width: min(600px, calc(100% - 30px)); max-width: 600px"
    @keydown.up="onKeyUp"
    @keydown.down="onKeyDown"
    @keydown.enter="onEnter"
  >
    <template #header>
      <div class="search-header">
        <el-input
          ref="inputRef"
          name="text"
          tabindex="1"
          v-model="text"
          :placeholder="$t('common.search')"
          @input="onInput"
        >
          <template #prefix>
            <m-svg-icon src="/icon/search.svg" class="m-icon2" />
          </template>
          <template #suffix>
            <m-svg-icon src="/icon/clear.svg" :class="`m-icon2 ${text ? 'clear-btn' : ''}`" @click="clear" />
          </template>
        </el-input>
      </div>
    </template>
    <template #footer>
      <div class="search-footer">
        <m-svg-icon src="/icon/right.svg" class="icon" style="transform: rotate(-90deg)" />
        <m-svg-icon src="/icon/right.svg" class="icon" style="transform: rotate(90deg)" />
        <div class="tip">{{ $t('search.upDown') }}</div>
        <m-svg-icon src="/icon/enter.svg" class="icon" />
        <div class="tip">{{ $t('search.enter') }}</div>
        <div class="icon">esc</div>
        <div class="tip">{{ $t('search.esc') }}</div>
        <div></div>
        <div></div>
      </div>
    </template>
    <el-scrollbar
      max-height="calc( 100vh - (var(--el-dialog-margin-top, 15vh)) * 2 - (var(--el-dialog-padding-primary)) * 4 - 45px)"
    >
      <div class="search-body" ref="searchBodyRef">
        <div
          v-for="(item, i) in matchMenus"
          :key="i"
          class="match-item"
          :class="{ focusItem: i === currentIndex }"
          :tabindex="i + 1"
          @focus="focusItem(i)"
          @mousemove="focusItem(i)"
          @click="toNavigate(i)"
        >
          <div v-for="(info, j) in item.info" :key="j">
            <m-icon class="info-icon" :value="info.icon" size="16" />
            {{ info.title }}
            <m-svg-icon v-if="j !== item.info.length - 1" class="separator" src="/icon/arrowRight.svg" />
          </div>
        </div>
      </div>
      <div v-if="!loading && text && !matchMenus.length" style="padding: 20px 0; text-align: center">
        {{ $t('search.empty') }}
        <span style="font-weight: bold">"{{ text }}"</span>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDebounceFn, useMagicKeys } from '@vueuse/core'
import { getOS } from '@/utils/index.js'
import { type Menu, useSystemStore } from '@/stores/system.js'

const visible = ref(false)
const text = ref('')
const inputRef = ref()
const searchBodyRef = ref()
const currentIndex = ref(0)
const loading = ref(false)
const systemStore = useSystemStore()
const menusObj = systemStore.menusObj
const fullMenus = computed(() => {
  return systemStore.menus
    .filter((i) => i.type === 'menu')
    .map((i) => {
      return {
        id: i.id,
        icon: i.icon,
        fullPath: i.fullPath,
        info: getMenuInfo(i.id)
      }
    })
})

interface SearchMenuLev {
  id: number
  icon: string
  title: string
}

const matchMenus = ref<typeof fullMenus.value>([])

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k') e.preventDefault()
    return false
  }
})
const os = getOS()
if (os === 'windows') {
  const CtrlK = keys['Ctrl+K']
  watch(CtrlK, openSearch)
}
if (os === 'macos') {
  const CommandK = keys['Cmd+K']
  watch(CommandK, openSearch)
}

function onKeyUp() {
  currentIndex.value--
  if (currentIndex.value < 0) {
    currentIndex.value = matchMenus.value.length - 1
  }
  scrollToView()
}

function onKeyDown() {
  currentIndex.value++
  if (currentIndex.value > matchMenus.value.length - 1) {
    currentIndex.value = 0
  }
  scrollToView()
}

function onEnter() {
  toNavigate(currentIndex.value)
}

async function scrollToView() {
  await nextTick()
  searchBodyRef.value.children[currentIndex.value].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  })
}

// 打开搜索框
async function openSearch() {
  currentIndex.value = 0
  visible.value = true
  await nextTick()
  setTimeout(() => {
    inputRef.value.focus()
  }, 1)
}

const onInput = useDebounceFn(onSearch, 300)

function onSearch(txt: string) {
  currentIndex.value = 0
  loading.value = true
  if (!txt) {
    matchMenus.value = []
    return
  }
  matchMenus.value = fullMenus.value.filter((i) => {
    return (
      i.info
        .map((i) => i.title)
        .join()
        .indexOf(txt) !== -1
    )
  })
  loading.value = false
}

function getMenuInfo(menuId?: number): SearchMenuLev[] {
  if (!menuId) return []
  const menu: Menu = menusObj[menuId]
  return [...getMenuInfo(menu.parentId), { id: menu.id, icon: menu.icon, title: menu.title }]
}

async function focusItem(i: number) {
  currentIndex.value = i
}

function toNavigate(i: number) {
  if (matchMenus.value.length) {
    visible.value = false
    systemStore.onMenuSelect(menusObj[matchMenus.value[i].id])
  }
}

function clear() {
  text.value = ''
  onSearch(text.value)
}
</script>
<style scoped lang="scss">
@use './action.scss';

.action-item {
  width: 18px;
}

.m-icon {
  width: 16px;
  display: block;
}

.m-icon2 {
  width: 18px;
  display: block;
}

.clear-btn {
  &:hover {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}

.search-view {
  height: var(--action-item-height);
  padding: 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background-color: var(--layout-bg-color);
  margin: 0 5px;
  transition: all 0.2s ease-out;
  border: 1px solid transparent;

  .search-btn {
    display: flex;
    align-items: center;
    gap: 8px;

    .ck {
      background-color: var(--el-bg-color);
      padding: 2px 4px;
      border-radius: 5px;
    }
  }

  &:hover {
    border: 1px solid var(--el-color-primary);
    border-radius: 5px !important;
  }
}

.search-header {
  display: flex;
}

.search-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-start;
  font-size: 0.8em;
  color: var(--el-text-color-secondary);

  .icon {
    display: block;
    height: 15px;
    line-height: 15px;
    padding: 5px;
    background-color: var(--layout-bg-color);
    border-radius: 5px;
  }

  .tip {
    margin-right: 10px;
  }
}

.search-body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .match-item {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 5px;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    border-radius: 5px;
    outline: none;

    > div {
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;

      > .separator {
        margin-left: 5px;
        display: block;
        width: 16px;
      }
    }
  }

  .focusItem {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-color-primary)) inset;
    color: var(--el-color-primary);
  }
}
</style>
