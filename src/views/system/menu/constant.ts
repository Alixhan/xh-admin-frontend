export const platFormList = [
  { value: 'web', label: 'WEB端' },
  { value: 'app', label: 'APP端' }
]
export const menuTypeList = [
  { value: 'dir', label: '目录' },
  { value: 'menu', label: '菜单' },
  { value: 'btn', label: '按钮' }
]

export const handleTypeList = [
  { value: 'route', label: 'route' },
  { value: 'iframe', label: 'iframe' },
  { value: 'outer', label: 'outer' }
]

/**
 * 转变为menu树形结构
 * @param list
 */
export function generateTreeMenu(list: any[]) {
  const obj = {}
  list.forEach((i) => {
    i.value = i.id
    i.label = i.title
    i.children = []
    obj[i.id] = i
  })
  return list.filter((i) => {
    const parent = obj[i.parentId]
    if (parent) {
      parent.children.push(i)
      return false
    }
    // parentId不存在的为根元素
    return true
  })
}
