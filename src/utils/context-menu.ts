import { ref } from 'vue'

/**
 * 展示右键上下文菜单，全局单例模式
 */
export interface ContextMenuItem {
  label: string
  icon?: any
  disabled?: boolean
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'

  [prop: string]: any
}

const contextMenuRef = ref()
const callback = ref<(menu: ContextMenuItem) => void>()

export function showContextMenu(e: PointerEvent, menus: ContextMenuItem[], onClick: (menu: ContextMenuItem) => void) {
  contextMenuRef.value.show(e, menus)
  callback.value = onClick
}

export default function () {
  return {
    contextMenuRef,
    callback
  }
}
