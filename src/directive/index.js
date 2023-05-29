import { useSystemStore } from '@/stores/system'

export default {
  install(app) {
    // 鉴权指令
    app.directive('auth', {
      mounted: (el, binding) => {
        const logicAnd = binding.modifiers.and // 权限逻辑运算符 or 或者 and， 默认的是or
        const full = binding.modifiers.full
        const value = binding.value // 权限name
        const bool = auth(value, logicAnd ? 'and' : 'or', full)
        if (!bool) el.parentNode?.removeChild(el)
      }
    })
  }
}

/**
 * 判断是否有权限
 * @param value <String|Array<String>>权限名称，单个可传字符串，多个传字符串数组
 * @param logic <String>逻辑运算符，'and'|'or'
 * @param full <Boolean> 是否全路径匹配
 */
export function auth(value, logic = 'or', full = false) {
  /**
   * 默认是匹配当前菜单下的权限
   * 传入full的话，就是直接匹配所有菜单权限，每个菜单的auth是经过拼接的（会拼接上父级auth:）
   */
  const systemStore = useSystemStore()
  // 如果是string就是传入单个权限name，其他类型就是数组
  if (!(value instanceof Array)) value = [value]
  let auth // 是否有权操作， 默认无
  if (full) {
    if (logic === 'and') {
      auth = value.every((i) => systemStore.menus.some((j) => j.auth === i))
    } else {
      auth = systemStore.menus.some((i) => value.some((j) => j === i.auth))
    }
  } else {
    // 当前菜单
    const currentMenu = systemStore.menus.find((i) => i.id === systemStore.activeMenuId)
    if (logic === 'and') {
      auth = value.every((i) => currentMenu.children?.some((j) => j.name === i))
    } else {
      auth = currentMenu.children?.some((i) => value.some((j) => j === i.name))
    }
  }
  return auth
}
