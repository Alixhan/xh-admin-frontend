# Table 表格

此表格组件基于 `ELTable`
的表格组件进行了封装增强，基础用法请参考 [Element Plus](https://element-plus.org/zh-CN/component/table.html) 官方文档。  
在原基础下，增强了一下特性：

1. 表格列定义可由数组定义
2. 可与后端查询列表集成，分页查询，简单搜索，复杂筛选
3. 自带excel导出功能，可导出当页或全部数据
4. 自带表格列设置，用户可动态控制列排列顺序、列显隐、列固定方向
5. 自带内存分页功能
6. 自带单选和多选功能，轻松实现数据选择功能
7. 自带按钮操作列收纳功能，在不同按权限下按钮动态调整列宽布局，保证整体样式饱满，避免变形
8. 自带内存排序和后端排序
9. 自带编辑功能，简单配置即可实现表格数据编辑，支持表格数据验证
10. 表格数据编辑继承 ^link(Form 表单) 的强大能力，简单配置就可实现所有表单控件的编辑功能，并自带数据验证

## 基础用法

:::demo
components/table/basic
:::

## 不分页

默认情况下，表格会自动内存分页，`isPage` 可以设置为 `false` 这样就不会分页

:::demo
components/table/not-page
:::

## 多级表头

:::demo
components/table/multi-header
:::

## 固定列

:::demo
components/table/fixed
:::

## 表尾合计行

:::demo
components/table/summary
:::

## 定制 el-table-column 插槽

通过 `slots` 属性我们可以使用jsx风格来定制 `el-table-column `插槽

:::demo
components/table/slots
:::

## slotName 定制插槽名

我们可以通过 `slotName` 属性来定制具名插槽的 name，这样就可以通过此 name 来使用模板插槽定义一些个性化的内容。

:::demo
components/table/slot-name
:::

## comment 备注信息

和 ^link(Form 表单) 一样，`MTable` 也支持 `comment` 备注信息，支持 VNode 定义备注内容

:::demo
components/table/comment
:::

## left-action 和 right-action 插槽

:::demo
components/table/action-slot
:::

## pagination 可以配置分页组

具体分页组件的属性参考 [ElPagination](https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7)

:::demo
components/table/pagination
:::

## selection 选择行数据

设置 `selection` 即可实现选择行功能，`selectionLimit` 可以限制选择的最大条数

:::demo
components/table/selection
:::

## operation 操作列

我们知道，在不同权限下，可能显示不同的按钮，`type` 为 `operation` 时可以很方便的实现按钮组的控制，会自动根据字数和按钮数量调整列的宽度，多出的按钮会自动收纳进下拉菜单中

:::demo
components/table/operation
:::

`buttons` 的 `auth` 属性会动态判断按钮权限，在无按钮权限时，自动隐藏该列，设置 `hidden` 属性为 `true` 可手动隐藏该按钮，
`icon` 属性还支持直接传入 ^link(Icon 图标) 组件的 `value` 展示自定义图标

:::demo
components/table/operation2
:::

## 和后端列表查询集成

直接提供 `fetch-data` 属性，即可实现后端列表查询，默认分页，设置 `isPage` 为 `false`

即可不分页查询所有数据，设置 `is-complex-filter` 为 `true` 开启高级筛选，

以下以查询系统菜单为例：

:::demo
components/table/fetch
:::

## 简单查询条件

设置 `is-filter-table` 为 `true` 即可配置简单查询条件，简单查询条件表单继承 ^link(Form 表单) 实现方式，简单配置即可实现所有表单组件功能

:::demo
components/table/fetch2
:::

## editable 表格数据编辑

设置 `editable` 为 `true` 则可以实现表格数据编辑，`editParam` 用来定制表单组件功能， 编辑功能继承 ^link(Form 表单)
强大能力，具体使用可参考 ^link(Form 表单)，简单配置即可实现编辑和验证功能，
还支持分页数据的验证。
:::demo
components/table/editable
:::

## 函数方式定义editParam

有时候我们需要根据行数据动态渲染表单内容， 此时 `editParam`
固定配置可能并不满足编辑表单的需求，支持以函数的方式提供 `editParam`，
这样可以更灵活的定制表单项。
:::demo
components/table/editable2
:::

## Table API

### Table 属性

| 属性名                        | 描述                                                                                         | 类型                                                                                                                                          | 默认值      |
|----------------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------|
| layout                     | 如果高度随内容自动增高：则需要设置为 `'auto'`, 如果需要自动充满父容器，设为 `'stretch'`                                    | `'auto'` \| `'stretch'`                                                                                                                     | —        |
| is-filter-table            | 是否是筛选过滤的表格，是：表格包含搜索框，同时布局上会有间距调整                                                           | ^[boolean]                                                                                                                                  | `false`  |
| is-export-excel            | 是否导出excel                                                                                  | ^[boolean]                                                                                                                                  | `true`   |
| export-file-name           | 导出的文件名                                                                                     | ^[string]                                                                                                                                   | `'表格数据'` |
| is-sort-column             | 是否表格列排序                                                                                    | ^[boolean]                                                                                                                                  | `true`   |
| is-complex-filter          | 是否高级筛选                                                                                     | ^[boolean]                                                                                                                                  | `false`  |
| selection                  | 可选择行的表格                                                                                    | `'multiple'` \| `'single'`                                                                                                                  | —        |
| selection-limit            | 最大选择行数                                                                                     | ^[number]                                                                                                                                   | —        |
| filter-columns             | 过滤column, [CommonFormColumn](/document/frontend/components/form.html#commonformcolumn-表单项) | ^[Array]`CommonFormColumn<T> []`                                                                                                            | —        |
| filter-param               | 过滤param查询条件数据对象                                                                            | ^[object]                                                                                                                                   | —        |
| columns                    | 表格列定义 [CommonTableColumn](#commontablecolumn-表格列)                                          | ^[Array]`CommonTableColumn<T> []`                                                                                                           | —        |
| fetch-data                 | 请求后台数据的方法                                                                                  | ^[Function]`(pageQuery: PageQuery, option: RequestOption<T>) => Promise<RestResponse<PageResult<T>>> 详细类型定义至 interface/utils/request.ts 查看` | —        |
| default-query              | 仅配置 `fetchData` 时生效，是否默认初始化就查询                                                             | ^[boolean]                                                                                                                                  | `true`   |
| data                       | 表格数据，后台查询表格时，使用 `v-model:data` 绑定获取查询的表格数据                                                 | ^[Array]`T []`                                                                                                                              | —        |
| is-page                    | 是否分页                                                                                       | ^[boolean]                                                                                                                                  | `true`   |
| pagination                 | 表格分页组件配置，参考 [ELPagination](https://element-plus.org/zh-CN/component/pagination.html)       | ^[object]                                                                                                                                   | —        |
| handle-type                | 表单处理类型，仅对编辑列有效                                                                             | ^[enum]`'add' \| 'edit' \| 'detail' \| string`                                                                                              | `'add'`  |
| sortable  ^(v1.6.0)primary | 列排序                                                                                        | ^[boolean]                                                                                                                                  | `true`   |

### Table Slots

| 插槽名            | 详情    | 类型 |
|----------------|-------|----|
| `left-action`  | 左侧操作栏 | —  |
| `right-action` | 右侧操作栏 | —  |

### Table Exposes

| 名称             | 详情             | 类型                               |
|----------------|----------------|----------------------------------|
| fetchQuery     | 执行数据查询         | ^[Function]`() => Promise<void>` | 
| validate       | 验证表格数据         | ^[Function]`() => Promise<void>` | 
| tableRef       | ElTableRef     | ^[Ref<ElTable>]                  | 
| formRef        | ElFormRef      | ^[Ref<ElForm>]                   | 
| exportExcelRef | ExportExcelRef | ^[Ref<MExportExcel>]             | 

## CommonTableColumn 表格列

仅列出新加的特有字段说明，关于 `ElTableColumn`
基础属性用法，可参考 [Element Plus](https://element-plus.org/zh-CN/component/table.html) 文档

| 字段        | 字段描述                                                 | 类型                                                                        |
|-----------|------------------------------------------------------|---------------------------------------------------------------------------|
| label     | 标题名称                                                 | ^[string]                                                                 |
| type      | 表格数据类型 [Table Type](#table-type-说明)                  | ^[string]                                                                 |
| prop      | 绑定行数据的属性                                             | ^[string]                                                                 |
| comment   | 疑问备注                                                 | ^[string] \| ^[VNode]                                                     |
| required  | 显示必填星号，一般在表格编辑时，标识此列必填                               | ^[boolean]                                                                |
| hidden    | 隐藏此列                                                 | ^[boolean]                                                                |
| notExport | 此列不导出到excel                                          | ^[boolean]                                                                |
| slots     | jsx 风格定义 `el-table-column` 插槽                        | ^[SlotsObj]`位于interface/components/index.ts，查看详细类型定义`                     |
| slotName  | 允许用户按照自己的slotName插槽定制                                | ^[string]                                                                 |
| itemList  | `type` 为 `'select'`  时的枚举选项                          | ^[Array]`CommonItemList []，位于 interface/components/index.ts，查看详细类型定义`     |
| labelKey  | 枚举选项的 labelKey，默认为 `'label'`                         | ^[string]                                                                 |
| valueKey  | 枚举选项的 valueKey，默认为 `'value'`                         | ^[string]                                                                 |
| buttons   | `type` 为 `'operation'` 时生效，定制操作列按钮                   | ^[Array]`OperationButton<T> []，位于 interface/components/table.ts，查看详细类型定义` |
| maxCount  | `type` 为 `'operation'` 时生效，按钮超过这个数量将被收纳进下拉菜单中        | ^[number]                                                                 |
| editable  | 变为可编辑列                                               | ^[boolean]                                                                |
| editParam | `editable` 为 `true`有效， 定制表单编辑参数，参考 ^link(Form 表单) 配置 | ^[object]`CommonFormColumn<T>`                                            |
| children  | 多级表头列定义                                              | ^[Array]`CommonTableColumn<T> []`                                         |

## Table Type 说明

用来区分列的用途，或者区分显示内容的数据类型，不同的数据类型在高级筛选中有不同的数据体验
| type | 描述 | 高级筛选|
|------------------------|----------------------------|----|
| `'text'`\| `undefined` | 普通文本列 |显示的是一个文本输入框|
| `'select'`             | 枚举列，需提供 `itemList` 属性定义枚举选项 |显示一个下拉框选择|
| `'number'`             | 数字列 | 只允许输入数字 |
| `'date'`               | 日期列 | 显示日期选择框 |
| `'dateTime'`           | 日期时间列 | 显示日期时间选择框 |
| `'index'`              | 表示这是一个序号列，自动显示数据的序号 | — |
| `'selection'`          | 表示这个一个选择列，显示 checkbox 或者 radio |— |
| `'operation'`          | 表示这个是一个操作按钮列 |— |
