import type { CommonItemList } from '@i/components'
import { datatype } from '@/utils/validate'

/**
 * rule type 枚举类型
 */
export type DataType = keyof typeof datatype

/**
 * 验证规则
 */
export interface ValidRule<T extends object, K extends keyof T> {
  // 预先定制一些规则，方便使用
  type?: DataType
  // 是否必填
  required?: boolean
  // 正则验证
  pattern?: RegExp
  // 最小值
  min?: number | string
  // 最大值
  max?: number | string
  // 最大字符长度
  maxlength?: number
  // 最小字符长度
  minlength?: number
  // 枚举值验证
  itemList?: CommonItemList
  // 枚举验证时的 labelKey
  labelKey?: string
  // 枚举验证时的 valueKey
  valueKey?: string
  // 自定义校验函数
  validator?: RuleValidator<T, K>
  // 验证时机，仅表单验证有效
  trigger?: string | 'blur' | 'change'
  // 定制验证错误的消息
  message?: string
  // 日期格式验证，dayjs 格式
  dateFormat?: string
}

/**
 * 自定义验证函数
 */
export type RuleValidator<T extends object, K extends keyof T> = (
  rule: ValidRule<T, K>,
  val: T[K] | any,
  callback: (errMsg?: Error) => void,
  formData?: T
) => void

/**
 * 单字段的验证规则
 */
export interface FieldRule<T extends object, K extends keyof T> {
  prop: K
  label?: string
  rules: ValidRule<T, K> | ValidRule<T, K>[]
}

/**
 * 单字段的验证规则（未知）
 */
export interface UnknownFieldRule<T extends object, K extends keyof T> {
  prop?: K
  label?: string
  rules?: ValidRule<T, K> | ValidRule<T, K>[]
}

/**
 * 验证规则对象
 */
export interface RuleObject<T extends object> {
  [prop: string]: UnknownFieldRule<T, keyof T>
}

/**
 * 验证结果
 */
export interface ValidResult<T extends object> {
  // 是否验证错误
  error: boolean
  // 是否验证成功
  success: boolean
  // 错误信息
  errFields: FieldValidResult<T, keyof T>[]
}

/**
 * 单字段验证结果
 */
export interface FieldValidResult<T, K extends keyof T> {
  // 字段property
  prop: K
  // 字段值
  value: T[K]
  // 验证结果
  result: boolean
  // 错误信息
  errMsg: string
}
