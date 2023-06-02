declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare type ColumnType =
  | ''
  | 'input'
  | 'text'
  | 'textarea'
  | 'password'
  | 'number'
  | 'year'
  | 'month'
  | 'date'
  | 'dates'
  | 'datetime'
  | 'week'
  | 'datetimerange'
  | 'daterange'
  | 'monthrange'
  | 'icon'
  | 'cascader'
  | 'checkbox'
  | 'checkbox-button'
  | 'checkbox-group'
  | 'color-picker'
  | 'date-picker'
  | 'input-number'
  | 'radio'
  | 'radio-button'
  | 'radio-group'
  | 'rate'
  | 'select'
  | 'select-v2'
  | 'slider'
  | 'switch'
  | 'time-picker'
  | 'time-select'
  | 'upload'
  | 'upload-file'
  | 'upload-img'

/**
 * 通用column类型
 */
declare type CommonColumn = {
  prop?: string
  prop2?: string
  type?: ColumnType
  style?: string
  valueFormat?: string
  single?: boolean
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
  slots?: {
    [slotName: string]: (any) => any
  }
  itemParam?: {
    border?: boolean
  }
  // [any: string]: any
}

declare type CommonItemList = CommonItemData[] | Promise<CommonItemData[]> | (() => CommonItemData[] | Promise<CommonItemData[]>)
declare type CommonItemData = {
  value?: number | string
  label?: number | string
  // [any: string]: any
}

declare type CommonModelParam = {
  start?: number | string
  end?: number | string
  modelValue?: any
  'onUpdate:modelValue'?: (val: any) => void
  'onUpdate:start'?: (val: any) => void
  'onUpdate:end'?: (val: any) => void
}


declare type TableColumn = CommonColumn & {

}


declare type RequestOption = {
  // 是否显示loading
  showLoading?: boolean
  // vue3中的ref,可以动态更新此值
  loadingRef?: import('vue').Ref<boolean>
  // 提交前是否显示确认弹框
  showBeforeConfirm?: boolean
  // 确认弹框按钮文字信息
  confirmButtonText?: string
  // 确认弹框的提示信息
  confirmMsg?: string
  // 加载中文本
  loadingText?: string
  // 显示成功的消息
  showSuccessMsg?: boolean
  // 成功消息的存续时间
  successDuration?: number
  // 成功的提示信息 | res为系统的返回值
  successMsg?: string | ((res: any) => string)
  // 失败消息的存续时间
  errorDuration?: number
  // 失败的提示信息 | res为系统的返回值
  errorMsg?: string | ((res: any) => string)
}

