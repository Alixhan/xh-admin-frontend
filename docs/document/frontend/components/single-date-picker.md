# SingleDatePicker 独立日期范围选择

因为 `ElDatePicker` 选择时间范围必须同时选择起止，为方便列表查询条件的日期范围选择写了此组件。

## 基础用法

:::demo
components/single-date-picker/basic
:::

## value 格式化

默认绑定 Date 类型，`value-format` 属性可格式化 value 值
:::demo
components/single-date-picker/format
:::

## SingleDatePicker API

### SingleDatePicker 属性

| 属性名                   | 描述                                                                     | 类型                                                | 默认值 |
|-----------------------|------------------------------------------------------------------------|---------------------------------------------------|-----|
| start / v-model:start | 绑定起始值                                                                  | ^[string] \| ^[Date]                              | 必填  |
| end / v-model:end     | 绑定截止值                                                                  | ^[string] \| ^[Date]                              | 必填  |
| value-format          | 格式化 value 值，参考 [dayjs](https://day.js.org/docs/en/parse/string-format) | ^[string]                                         | —   |
| type                  | 绑定的值                                                                   | ^['datetimerange' \| 'daterange' \| 'monthrange'] | 必填  |
| start-placeholder     | start-placeholder                                                      | ^[string]                                         | —   |
| end-placeholder       | end-placeholder                                                        | ^[string]                                         | —   |
| range-separator       | 分隔符                                                                    | ^[string]                                         | -   |
