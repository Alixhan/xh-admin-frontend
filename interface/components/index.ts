import type { VNode, Ref } from 'vue'

export type SlotRender = (...args : any []) => VNode | VNode []

export type SlotsObj = {
  [slotName: string]: SlotRender
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
    | 'autocomplete'


/**
 * 通用column
 */
export interface CommonColumn {
  // 列类型
  type?: CommonColumnType
  // 列key唯一标识
  key?: string;
  //是否隐藏
  hidden?: boolean;
  //标签名称
  label?: string;
}

export declare type CommonItemList = Ref<CommonItemData []> | CommonItemData[] | Promise<CommonItemData[]> | (() => CommonItemData[] | Promise<CommonItemData[]>)

export interface CommonItemData {
  value?: number | boolean | string
  label?: string
}

export interface CommonModelParam {
  start?: number | string
  end?: number | string
  modelValue?: any
  'onUpdate:modelValue'?: (val: any) => void
  'onUpdate:start'?: (val: any) => void
  'onUpdate:end'?: (val: any) => void
}

/**
 *
 */
export interface ItemListColumn {
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
}
