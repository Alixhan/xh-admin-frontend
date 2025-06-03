<template>
  <el-tooltip
    v-model:visible="visible"
    placement="bottom"
    effect="light"
    virtual-triggering
    :virtual-ref="triggerRef"
    :hide-after="0"
    popper-style="padding: 5px 0;"
  >
    <template #content>
      <div ref="tipRef" class="menu-view">
        <slot>
          <el-link
            v-for="(menu, i) in menuItems"
            class="menu-item"
            :class="{ 'disable-menu': menu.disabled }"
            :key="i"
            v-bind="menu"
            @click="clickMenu(menu)"
            underline="never"
          >
            {{ menu.label }}
          </el-link>
        </slot>
      </div>
    </template>
  </el-tooltip>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { ContextMenuItem, ContextMenuOption } from '@/utils/context-menu'

/**
 * 上下文菜单
 */
defineOptions({
  name: 'ContextMenu'
})

const visible = defineModel<boolean>({ default: true })
const menuItems = ref<ContextMenuItem[]>([])
const top = ref<any>(0)
const left = ref<any>(0)
const onClick = ref<ContextMenuOption['onClick']>()

const tipRef = ref()
onClickOutside(tipRef, () => (visible.value = false))

const triggerRef = ref({
  getBoundingClientRect() {
    return DOMRect.fromRect({
      width: 0,
      height: 0,
      x: left.value,
      y: top.value
    })
  }
})

function show(option: ContextMenuOption) {
  menuItems.value = option.menus
  left.value = option.clientX
  top.value = option.clientY
  onClick.value = option.onClick
  visible.value = true
}

function clickMenu(menu: ContextMenuItem) {
  onClick.value?.(menu)
  visible.value = false
}

defineExpose({
  show
})
</script>
<style scoped lang="scss">
.menu-view {
  display: flex;
  flex-direction: column;

  .menu-item {
    padding: 5px 10px;
    justify-content: flex-start;
    display: inline-flex;

    &:hover:not(.disable-menu) {
      background-color: var(--el-color-primary-light-9);
    }
  }
}
</style>
