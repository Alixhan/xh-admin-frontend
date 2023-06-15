/**
 * sxh 2020-10-13
 * 验证通用方法
 */
import { isEmpty } from 'lodash'
import type { CommonItemData, CommonItemList } from '@/components/mutils'
import type { Ref } from 'vue'
import { getItemListRef } from '@/components/mutils'

export interface ValidRule {
  label?: string
  type?: string | 'phone' | 'email' | 'username' | 'double' | 'vin' | 'number' | 'idCard' | 'carNum'
  required?: boolean
  pattern?: RegExp
  maxlength?: number
  minlength?: number
  itemList?: CommonItemList
  validator?: (rule: ValidRule, val: any, callback: (errMsg?: Error) => void, formValue?: object) => void
  trigger?: string | 'blur' | 'change'
  message?: string
  dateFormat?: string
  labelKey?: string
  valueKey?: string
}

export interface RuleObject {
  [any: string]: ValidRule
}

export interface ValidResult {
  error: boolean
  success: boolean
  errFields: FieldValidResult[]
}

export interface FieldValidResult {
  fieldName: string
  formValue: any
  result: boolean
  errMsg: string
}

// 验证类型定义
const datatype: { [any: string]: RegExp | ((val: any) => boolean) } = {
  phone: /^1\d{10}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  username: /^[\u4E00-\u9FA5A-Za-z]+$/,
  double: /^\d+(\.\d{1,2})?$/,
  vin: /^[A-Z0-9]{17}$/,
  number: /^(-?\d+)(\.\d+)?$/,
  idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  carNum:
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
}

// 整个表单验证
export default function (formData: object, ruleObject: RuleObject): Promise<ValidResult> {
  const formPromiseArr: Promise<FieldValidResult>[] = []
  for (const field in ruleObject) {
    formPromiseArr.push(fieldValid(field, ruleObject[field], formData[field], formData))
  }
  return Promise.all(formPromiseArr).then((res) => {
    const errFields = res.filter((i) => !i.result)
    return {
      error: !!errFields.length,
      success: !errFields.length,
      errFields,
    }
  })
}

// 单个字段多个rules验证
export function fieldValid(fieldName: string, rules: ValidRule | ValidRule[], formValue: any, formData: object): Promise<FieldValidResult> {
  rules = rules instanceof Array ? rules : [rules ?? {}]
  const rulePromiseArr = rules.map((rule) => ruleValid(rule, formValue, formData, fieldName))
  return Promise.all(rulePromiseArr).then((e) => {
    // 过滤正确，分号拼接错误信息
    const errMsg = e.filter((i) => i).join(';')
    return {
      fieldName,
      formValue,
      result: !errMsg,
      errMsg,
    }
  })
}

// 单个rule验证
export function ruleValid(rule: ValidRule = {}, formValue: any = '', formData?: object, fieldName: string = ''): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (rule.required) {
      // 验证必填
      if ((formValue instanceof Array && formValue.length === 0) || isEmpty(formValue + '')) {
        return reject(rule.message || (rule.label || '') + '不能为空')
      }
    }
    if (!formValue && !rule.validator) return resolve('')
    if (rule.type) {
      // 验证数据类型是否满足
      const typeFilter = datatype[rule.type]
      if (!typeFilter) {
        return reject(rule.type + '未定义！')
      }
      if (typeFilter instanceof RegExp) {
        if (!typeFilter.test(formValue)) return reject(rule.message || (rule.label || '') + '格式不对')
      } else {
        const re = typeFilter(formValue)
        if (!re) return reject(rule.message || (rule.label || '') + '格式不对')
      }
    }
    if (rule.pattern) {
      // 验证数据格式
      if (!rule.pattern.test(formValue)) {
        return reject(rule.message || (rule.label || '') + '格式不对')
      }
    }
    if (rule.maxlength) {
      // 验证字符最大长度
      if (formValue.length > rule.maxlength) {
        return reject(rule.message || (rule.label || '') + '最大字符不超过' + rule.maxlength)
      }
    }
    if (rule.minlength) {
      // 验证字符最小长度
      if (formValue.length < rule.minlength) {
        return reject(rule.message || (rule.label || '') + '不得少于' + rule.minlength + '个字符')
      }
    }
    // 下拉选项验证
    if (rule.itemList) {
      const itemList: Ref<CommonItemData[]> = getItemListRef({
        itemList: rule.itemList,
        labelKey: rule.labelKey,
        valueKey: rule.valueKey,
      })
      const item = itemList.value.find((i) => i.label === formValue)
      if (item) {
        formData?.[fieldName] && (formData[fieldName] = item.value)
      } else {
        return reject(rule.message || `${rule.label}的值只能为(${itemList.value.map((i) => i.label)})`)
      }
    }
    // 自定义验证方法
    if (rule.validator) rule.validator(rule, formValue, (e) => (e instanceof Error ? reject(e.message) : ''), formData)
    else resolve('')
  }).catch((e: string) => e) // 捕获错误信息，resolve Promise
}
