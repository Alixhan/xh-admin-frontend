import type { App, VNode } from 'vue'
import { type AppContext, createVNode, render } from 'vue'
import ContextMenu from '@/components/ContextMenu.vue'

export interface ContextMenuOption {
  // 菜单
  menus: ContextMenuItem[]
  // 点击回调函数
  onClick: (menu: ContextMenuItem) => void
  // x方向位置
  clientX: number
  // y方向位置
  clientY: number
}

export interface ContextMenuItem {
  label: string
  icon?: string | VNode
  disabled?: boolean
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'

  [prop: string]: any
}

let vn: VNode

/**
 * 展示上下文菜单，全局单例模式
 */
function _showContextMenu(option: ContextMenuOption) {
  if (!vn) {
    const container = document.createElement('div')
    vn = createVNode(ContextMenu, { ...option })
    vn.appContext = showContextMenu._context
    render(vn, container)
    document.body.appendChild(container)
  }
  vn.component?.exposed?.show(option)
}

export const showContextMenu = _showContextMenu as typeof showContextMenu & {
  _content: AppContext | null
}

function install(app: App) {
  showContextMenu._context = app._context
}

export default {
  install
}
