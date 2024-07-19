# Icon 图标

图标选择与展示

## 图标选择器

`IconSelect` 组件可用于选择一个el图标或者svg图标，该组件会自动解析 /src/assets/icon/ 目录下的所有svg图标
:::demo
components/icon/icon-select
:::

## 图标显示

`Icon` 组件可用于展示图标，并可与 `el-icon` 组件组合使用。
:::demo
components/icon/icon
:::

## SVG 图标

`SvgIcon` 组件可用于展示显示svg图标，并可以编辑svg图标，如下例子 `property` 的 `fill` 属性表示该属性值用于替换svg源码中的fill属性，
用逗号拆分后，会替换对应索引的fill属性值，从而达到动态修改svg图标颜色的目的。
:::demo
components/icon/svg-icon
:::

## IconSelect API

### IconSelect 属性

| 属性名                   | 描述   | 类型         | 默认值   |
|-----------------------|------|------------|-------|
| model-value / v-model | 绑定的值 | ^[string]  | —     |
| readonly              | 是否只读 | ^[boolean] | false |
| disabled              | 是否禁用 | ^[boolean] | false |

## Icon API

### Icon 属性

| 属性名   | 描述                                         | 类型        | 默认值 |
|-------|--------------------------------------------|-----------|-----|
| value | 接收 `IconSelect` 组件的 `model-value` 值，展示对应图标 | ^[string] | —   |

## SvgIcon API

### SvgIcon 属性

| 属性名       | 描述         | 类型         | 默认值  |
|-----------|------------|------------|------|
| src       | 图标路径       | ^[string]  | 必填   |
| property  | 修改svg属性值   | ^[object]  | —    |
| inherited | 是否继承当前字体颜色 | ^[boolean] | true |
