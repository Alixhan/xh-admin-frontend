# Validate 数据验证

提供框架的统一数据验证逻辑，增强 `Element-Plus` 表单验证的 `rules` 规则。

## 单值验证

`fieldValid`函数可用于验证单个值，返回异步的`Promise`验证结果
:::demo
utils/validate/fieldValid
:::

## 表单对象验证

可直接验证整个对象数据，返回异步的`Promise`验证结果
:::demo
utils/validate/formValid
:::

## ValidRule 规则定义

| 字段         | 字段描述                                                                             | 类型                                                                                                        |
|------------|----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| type       | 预先定制一些规则，方便使用，可以行添加                                                              | `'number'` \| `'phone'` \| `'double'` \| `'idCard'` \| `'carNum'` \| `'vin'` \| `'email'` \| `'username'` |
| required   | 是否必填                                                                             | ^[boolean]                                                                                                |
| pattern    | 正则验证                                                                             | ^[RegExp]                                                                                                 |
| min        | 最小值，可填数字和时间字符串                                                                   | ^[number] \| ^[string]                                                                                    |
| max        | 最大值，可填数字和时间字符串                                                                   | ^[number] \| ^[string]                                                                                    |
| maxlength  | 最大字符长度                                                                           | ^[number]                                                                                                 |
| minlength  | 最小字符长度                                                                           | ^[number]                                                                                                 |
| itemList   | 枚举值验证                                                                            | ^[CommonItemList]`位于 interface/components/index.ts，查看详细类型定义`                                              |
| labelKey   | 枚举验证时的 labelKey                                                                  | ^[string]                                                                                                 |
| valueKey   | 枚举验证时的 valueKey                                                                  | ^[string]                                                                                                 |
| validator  | 自定义校验函数                                                                          | ^[Function]`(rule: ValidRule, val: any, callback: (errMsg?: Error) => void, formData?: T) => void`        |
| trigger    | 验证时机，仅表单验证有效                                                                     | ^['blur' \| 'change']                                                                                     |
| message    | 为空时，错误信息默认由字段标题拼接而成，可填此字段定制验证错误的消息                                               | ^[string]                                                                                                 |
| dateFormat | 日期格式验证，[dayjs](https://day.js.org/docs/en/parse/string-format) 格式，例：`YYYY-MM-DD` | ^[string]                                                                                                 |
