/**
 * sxh 2020-10-13
 * 验证通用方法
 */
import { isEmpty } from 'lodash'

// 验证类型定义
const datatype = {
  phone: /^1\d{10}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  username: /^[\u4E00-\u9FA5A-Za-z]+$/,
  double: /^\d+(\.\d{1,2})?$/,
  vin: /^[A-Z0-9]{17}$/,
  number: /^(-?\d+)(\.\d+)?$/,
  idCard:
    /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  carNum:
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
}

// 整个表单验证
export default function (formData, validRule) {
  const formPromiseArr = []
  for (const field in validRule) {
    formPromiseArr.push(fieldValid(field, validRule[field], formData[field], formData))
  }
  return Promise.all(formPromiseArr).then((res) => {
    const errFields = res.filter((i) => !i.result)
    return {
      validError: !!errFields.length,
      success: !errFields.length,
      errFields
    }
  })
}

// 单个字段多个rules验证
export function fieldValid (fieldName, rules, formValue, formData) {
  rules = rules instanceof Array ? rules : [rules ?? {}]
  const rulePromiseArr = rules.map((rule) => {
    return ruleValid(rule, formValue, formData)
  })
  return Promise.all(rulePromiseArr).then((e) => {
    // 过滤正确，分号拼接错误信息
    const errMsg = e.filter((i) => i).join(';')
    return {
      fieldName,
      formValue,
      result: !errMsg,
      errMsg
    }
  })
}

// 单个rule验证
export function ruleValid (rule = {}, formValue = '', formData) {
  return new Promise((resolve, reject) => {
    if (rule.required) {
      // 验证必填
      if ((formValue instanceof Array && formValue.length === 0) || isEmpty(formValue + '')) {
        return reject(rule.message || (rule.label || '') + '不能为空')
      }
    }
    if (rule.type && formValue) {
      // 验证数据类型是否满足
      const typeFilter = datatype[rule.type]
      if (typeFilter) {
        if (typeFilter instanceof RegExp) {
          if (!typeFilter.test(formValue)) {
            return reject(rule.message || (rule.label || '') + '格式不对')
          }
        } else if (typeFilter instanceof Function) {
          const re = typeFilter(formValue)
          if (!re) {
            return reject(rule.message || (rule.label || '') + '格式不对')
          }
        }
      } else {
        return reject(rule.type + '未定义！')
      }
    }
    if (rule.pattern && formValue) {
      // 验证数据格式
      if (!rule.pattern.test(formValue)) {
        return reject(rule.message || (rule.label || '') + '格式不对')
      }
    }
    if (rule.maxlength && formValue) {
      // 验证字符最大长度
      if (formValue.length > rule.maxlength) {
        return reject(rule.message || (rule.label || '') + '最大字符不超过' + rule.maxlength)
      }
    }
    if (rule.minLength && formValue) {
      // 验证字符最小长度
      if (formValue.length < rule.minLength) {
        return reject(rule.message || (rule.label || '') + '不得少于' + rule.minLength + '个字符')
      }
    }
    if (rule.validator) {
      // 自定义验证方法
      rule.validator(
        rule,
        formValue,
        (e) => {
          if (e instanceof Error) {
            reject(e.message)
          } else {
            resolve()
          }
        },
        formData
      )
    } else {
      resolve()
    }
  }).catch((e) => e) // 捕获错误信息，resolve Promise
}
