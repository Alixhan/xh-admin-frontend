# ContextMenu 上下文菜单

提供一个工具类函数，非常方便的显示上下文菜单，灵活定位其显示位置。

- 通过此函数显示的上下文菜单为单例模式。
- 单击其他位置或者鼠标失焦菜单会自动隐藏。
- 点击菜单后触发回调函数，菜单也会自动隐藏。

## 基础使用

:::demo
utils/context-menu/basic
:::

## 自定义菜单图标

`icon` 属性默认显示 `element` 的图标，但也可以返回一个 `vNode` 来自定义图标
:::demo
utils/context-menu/icon
:::

## 禁用菜单

设置 `disabled` 为 `true` 即可禁用该菜单选项
:::demo
utils/context-menu/disabled
:::

## 类型定义

```ts
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
    icon?: any
    disabled?: boolean
    type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'

    [prop: string]: any
}
```
