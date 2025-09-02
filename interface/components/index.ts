import type { VNode, Ref } from 'vue'

export type SlotRender = (...args: any[]) => VNode | VNode[] | string | string[] | (() => VNode | VNode[])

export type SlotsObj = {
  [slotName: string]: SlotRender | (() => SlotRender)
}

/**
 * 列类型
 */
export declare type CommonColumnType =
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
  | 'icon-select'
  | 'autocomplete'
  | 'tree-select'
  | 'color-picker-panel'
  | 'date-picker-panel'
  | 'input-tag'
  | 'mention'
  | 'span'
  | 'div'
  | 'p'
  | 'a'
  | 'i'
  | 'blank'

/**
 * itemList 类型
 */
export declare type CommonItemList =
  | Ref<CommonItemData[]>
  | CommonItemData[]
  | Promise<CommonItemData[]>
  | (() => CommonItemData[] | Promise<CommonItemData[]>)

/**
 * 选项数据类型
 */
export interface CommonItemData {
  // 选项的值
  value?: number | boolean | string
  // 选项的名称
  label?: string

  [prop: string]: any
}

/**
 * 双向绑定参数
 */
export interface CommonModelParam {
  start?: number | string
  end?: number | string
  modelValue?: any
  'onUpdate:modelValue'?: (val: any) => void
  'onUpdate:start'?: (val: any) => void
  'onUpdate:end'?: (val: any) => void
}

/**
 * 字典枚举的列
 */
export interface ItemListColumn {
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
}
