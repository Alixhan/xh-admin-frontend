# Form 表单

表单组件继承自 `ElForm` 组件，基础用法请参考 [Element Plus](https://element-plus.org/zh-CN/component/form.html)
官方文档。

在原有表单基础上增加了以下功能：

1. 表单项定义可以由数据定义，此时数据将自动双向绑定
2. 表单验证得到增强，参考 ^link(Validate 数据验证)
3. 集成了自定义表单组件，更方便使用
4. 表单会自动根据设备宽度动态调整布局
5. 表单数据在加载时自带骨架屏
6. 所有附件上传服务器的逻辑调整至表单提交且表单验证通过后统一上传

## 基础用法

:::demo
components/form/basic
:::

## render 自定义渲染项

:::demo
components/form/render
:::

## slots 定义组件插槽

:::demo
components/form/slots
:::

## loading 加载中

表单数据未加载完成前，展示骨架屏
:::demo
components/form/skeleton
:::

## slotName 声明插槽完全定制表单项

`slotName` 属性声明插槽 `name`，这样可以通过具名插槽来完全定制表单项
:::demo
components/form/slotName
:::

## jsx 风格绑定事件

在模板中我们一般使用 `@事件名` 来绑定事件， 表单组件基于 `jsx` 动态实现，所以绑定事件应调整为 `on事件名` 的函数名来绑定事件，
如 `onChange`
:::demo
components/form/event
:::

## colspan 定制跨列规则

form的 `colspan` 属性定义表单的col跨度，采用24分隔法，表单项的 `colspan`
属性用户覆盖form配置，cols表示跨表单项数，通过组合使用灵活实现跨列需求
:::demo
components/form/span
:::

## comment 备注信息

满足对表单项有特殊说明的需求，支持 VNode 定义备注内容
:::demo
components/form/comment
:::

## Native 特殊表单项类型

有时候，有些表单项可能只是要展示一些内容而已，用插槽自定义来实现又比较麻烦，所以增加此类型方便使用
:::demo
components/form/native
:::

## $param 属性名冲突时的处理 ^(v1.6.0)primary

有时候，表单列的属性定义可能和某些表单组件的属性名重合，导致无法单独定义表单组件的属性值，我们可以使用 `$param` 属性做单独配置，
通过 `$param` 配置表单组件属性时，优先级更高。
:::demo
components/form/$param
:::

## Form API

### Form 属性

| 属性名        | 描述                                              | 类型                                      | 默认值     |
|------------|-------------------------------------------------|-----------------------------------------|---------|
| handleType | 表单处理类型                                          | `add` \| `edit` \| `detail` \| `string` | `'add'` |
| colspan    | el-col默认跨度                                      | ^[number]                               | —       |
| model      | 表单数据对象                                          | ^[object]                               | 必填      |
| columns    | 表单项定义 [CommonFormColumn](#commonformcolumn-表单项) | ^[Array]`CommonFormColumn []`           | —       |
| labelWidth | 表单标题宽度                                          | ^[string] \| ^[number]                  | —       |
| loading    | 加载状态，为true时展示骨架屏                                | ^[boolean]                              | —       |

### Form Slots

| 插槽名      | 详情                 | 类型 |
|----------|--------------------|----|
| `string` | 通过slotName 动态指定插槽名 | —  |

### Form Exposes

| 方法名    | 详情           | 类型                               |
|--------|--------------|----------------------------------|
| submit | 提交表单，验证并上传附件 | ^[Function]`() => Promise<void>` | 

## CommonFormColumn 表单项

仅列出本项目特有字段说明，对应表单组件的的属性文档，请查阅 [Element Plus](https://element-plus.org/zh-CN) 文档

| 字段                      | 字段描述                                                               | 类型                                                           |
|-------------------------|--------------------------------------------------------------------|--------------------------------------------------------------|
| label                   | 标题名称                                                               | ^[string]                                                    |
| type                    | 表单类型，参考下方表单类型对照表                                                   | ^[string]                                                    |
| hidden                  | 隐藏此列                                                               | ^[boolean]                                                   |
| prop                    | 绑定表单的属性                                                            | ^[string]                                                    |
| prop2                   | 表单属性2 ，`'daterange'`, `'datetimerange'`, `'monthrange'` 可能会使用      | ^[string]                                                    |
| rules                   | 验证规则，参考 ^link(Validate 数据验证)                                       | ^[ValidRules]`ValidRule \| ValidRule []`                     |
| render                  | 自定义渲染，参数为默认渲染的vNode                                                | ^[Function]`(vNode: VNode) => VNode`                         |
| comment                 | 疑问备注                                                               | ^[string] \| ^[VNode]                                        |
| required                | 显示必填星号                                                             | ^[boolean]                                                   |
| slots                   | 表单项插槽                                                              | ^[SlotsObj]`位于interface/components/index.ts，查看详细类型定义`        |
| slotName                | 允许用户按照自己的slotName插槽定制                                              | ^[string]                                                    |
| optionParam             | 定制 `'radio-group'` 和 `'checkbox-group'` 的选项参数                      | ^[object]                                                    |
| itemList                | type = `'select'`  \| `'radio-group'` \| `'checkbox-group'` 时的枚举选项 | ^[CommonItemList]`位于 interface/components/index.ts，查看详细类型定义` |
| labelKey                | 枚举选项的 labelKey，默认为 `label`                                         | ^[string]                                                    |
| valueKey                | 枚举选项的 valueKey，默认为 `value`                                         | ^[string]                                                    |
| $param ^(v1.6.0)primary | 当column属性和表单组件属性名冲突时，可通过此属性给表单组件做覆盖配置                              | ^[object]`{[prop: string]: any}`                             |

## Form Type 对照表

| type值                                                                                                                              | 对应组件                                              | 说明                            |
|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|-------------------------------|
| `'text'` \| `'textarea'` \| `'password'` \| `'number'` \| `undefined`                                                              | ElInput                                           |                               |
| `'year'` \| `'month'` \| `'date'` \| `'dates'` \| `'datetime'` \| `'week'` \| `'datetimerange'` \| `'daterange'` \| `'monthrange'` | ElDatePiker                                       |                               |
| `'autocomplete'`                                                                                                                   | ElAutocomplete                                    |                               |
| `'cascader'`                                                                                                                       | ElCascader                                        |                               |
| `'checkbox'`                                                                                                                       | ElCheckbox                                        |                               |
| `'checkbox-button'`                                                                                                                | ElCheckboxButton                                  |                               |
| `'color-picker'`                                                                                                                   | ElColorPicker                                     |                               |
| `'input-number'`                                                                                                                   | ElInputNumber                                     |                               |
| `'radio'`                                                                                                                          | ElRadio                                           |                               |
| `'radio-button'`                                                                                                                   | ElRadioButton                                     |                               |
| `'rate'`                                                                                                                           | ElRate                                            |                               |
| `'select'`                                                                                                                         | ElSelect                                          |                               |
| `'select-v2'`                                                                                                                      | ElSelectV2                                        |                               |
| `'slider'`                                                                                                                         | ElSlider                                          |                               |
| `'switch'`                                                                                                                         | ElSwitch                                          |                               |
| `'time-picker'`                                                                                                                    | ElTimePicker                                      |                               |
| `'time-select'`                                                                                                                    | ElTimeSelect                                      |                               |
| `'upload'`                                                                                                                         | ElUpload                                          |                               |
| `'radio-group'`                                                                                                                    | ElRadioGroup                                      |                               |
| `'checkbox-group'`                                                                                                                 | ElCheckboxGroup                                   |                               |
| `'tree-select'`   ^(v1.6.0)primary                                                                                                 | ElTreeSelect                                      |                               |
| `'color-picker-panel'`  ^(v1.6.0)primary                                                                                           | ElColorPickerPanel                                |                               |
| `'date-picker-panel'`   ^(v1.6.0)primary                                                                                           | ElDatePickerPanel                                 |                               |
| `'input-tag'`  ^(v1.6.0)primary                                                                                                    | ElInputTag                                        |                               |
| `'mention'` ^(v1.6.0)primary                                                                                                       | ElMention                                         |                               |
| `'icon-select'`                                                                                                                    | [MIconSelect](/document/frontend/components/icon) |                               |
| `'upload-img'`  \| `'upload-file'`                                                                                                 | [MUpload](/document/frontend/components/upload)   |                               |
| `'span'`\| `'div'`\| `'p'`\| `'a'`\| `'i'`                                                                                         | MNative                                           | 表单的值将作为这些原生标签的 innerHtml 插入展示 |
| `'blank'`                                                                                                                          | MNative                                           | 将此表单项将显示为空                    |
