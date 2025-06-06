/**
 * 静态菜单，只有在开发环境显示
 */
export const devMenus = [
  {
    id: -1,
    title: '开发文档demo',
    name: 'demo',
    path: 'demo',
    type: 'dir',
    icon: 'el|menu'
  },
  {
    id: -2,
    parentId: -1,
    title: '通用表格Table',
    name: 'table',
    path: 'table',
    component: '/src/views/demo/table.vue',
    type: 'menu',
    handleType: 'route',
    icon: 'el|menu',
    cache: true,
    enabled: true
  },
  {
    id: -3,
    parentId: -1,
    title: '通用表单Form',
    name: 'form',
    path: 'form',
    component: '/src/views/demo/form.vue',
    type: 'menu',
    handleType: 'route',
    icon: 'el|menu',
    cache: true,
    enabled: true
  },
  {
    id: -4,
    parentId: -1,
    title: '测试页面',
    name: 'test',
    path: 'test',
    component: '/src/views/demo/index.vue',
    type: 'menu',
    handleType: 'route',
    icon: 'el|menu',
    cache: true,
    enabled: true
  }
]
