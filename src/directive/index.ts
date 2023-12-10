import type { DirectiveBinding } from 'vue'
import type { Menu } from '@/stores/system'
import { useSystemStore } from '@/stores/system'

export const AuthDirective = {
  mounted: (el: Element, binding: DirectiveBinding) => {
    const logicAnd = binding.modifiers.and // 权限逻辑运算符 or 或者 and， 默认的是or
    const value = binding.value // 权限name
    const bool = auth(value, logicAnd ? 'and' : 'or')
    if (!bool) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 判断是否有权限
 * @param value <String|Array<String>>权限名称，单个可传字符串，多个传字符串数组
 * @param logic <String>逻辑运算符，'and'|'or'
 */
export function auth(value: string | string[], logic: 'or' | 'and' = 'or'): boolean {
  /**
   * 默认是匹配当前菜单下的权限
   * 传入full的话，就是直接匹配所有菜单权限，每个菜单的auth是经过拼接的（会拼接上父级auth:）
   */
  const systemStore = useSystemStore()
  const menus: Menu[] = systemStore.menus
  // 如果是string就是传入单个权限name，其他类型就是数组
  const val: string[] = value instanceof Array ? value : [value]
  let auth: boolean // 是否有权操作， 默认无
  if (logic === 'and') {
    auth = val.every((i) => menus.some((j) => j.name === i))
  } else {
    auth = menus.some((i) => val.some((j) => j === i.name))
  }
  return auth
}
