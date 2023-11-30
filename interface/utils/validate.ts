import type { CommonItemList } from '@i/components'

export interface ValidRule<T extends object, K extends keyof T> {
  type?: string | 'phone' | 'email' | 'username' | 'double' | 'vin' | 'number' | 'idCard' | 'carNum'
  required?: boolean
  pattern?: RegExp
  maxlength?: number
  minlength?: number
  itemList?: CommonItemList
  validator?: (rule: ValidRule<T, K>, val: T[K], callback: (errMsg?: Error) => void, formData?: T) => void
  trigger?: string | 'blur' | 'change'
  message?: string
  dateFormat?: string
  labelKey?: string
  valueKey?: string
}

export interface FieldRule<T  extends object, K extends keyof T> {
  prop: K
  label?: string
  rules: ValidRule<T, K> | ValidRule<T, K>[]
}

export interface RuleObject<T extends object> {
  [prop: string]: FieldRule<T, keyof T>
}

export interface ValidResult<T extends object> {
  error: boolean
  success: boolean
  errFields: FieldValidResult<T, keyof T>[]
}

export interface FieldValidResult<T, K extends keyof T> {
  prop: K
  formValue:  T[K]
  result: boolean
  errMsg: string
}
