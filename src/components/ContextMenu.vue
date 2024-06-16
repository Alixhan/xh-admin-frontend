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
            :underline="false"
          >
            {{ menu.label }}
          </el-link>
        </slot>
      </div>
    </template>
  </el-tooltip>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

/**
 * 上下文菜单
 */

defineOptions({
  name: 'ContextMenu'
})

export interface ContextMenuItem {
  label: string
  icon?: any
  disabled?: boolean
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger',
  [prop: string]: any
}

const visible = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  (e: 'click', data: ContextMenuItem): void
}>()

const menuItems = ref<ContextMenuItem []>([])
const top = ref<any>(0)
const left = ref<any>(0)

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

function show(el: PointerEvent, menus: ContextMenuItem []) {
  menuItems.value = menus
  left.value = el.clientX
  top.value = el.clientY + 10
  visible.value = true
}

function clickMenu(menu: ContextMenuItem) {
  emit('click', menu)
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
      color: var(--el-color-primary);
    }
  }
}
</style>
