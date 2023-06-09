import type { Ref } from 'vue'
import { createVNode, isRef, ref, toRaw } from 'vue'
import { ruleValid } from '@/utils/validate'
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElUpload,
} from 'element-plus'
import SingleDatePicker from '@/components/form/SingleDatePicker.vue'
import IconSelect from '@/components/form/IconSelect.vue'
import MUpload from '@/components/form/Upload.vue'

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

/**
 * 通用column类型
 */
export interface CommonColumn {
  prop?: string
  prop2?: string
  label?: string
  type?: CommonColumnType
  style?: string
  valueFormat?: string
  single?: boolean
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
  rules?: import('@/utils/validate').ValidRule | Array<import('@/utils/validate').ValidRule>
  slots?: {
    [slotName: string]: (any) => any
  }
  itemParam?: {
    border?: boolean
  }
  //定义一个插槽名称，此项可以作为组件的插槽名使用
  slotName?: string
  [any: string]: any
}

export declare type CommonItemList = CommonItemData[] | Promise<CommonItemData[]> | (() => CommonItemData[] | Promise<CommonItemData[]>)

export interface CommonItemData {
  value?: number | string
  label?: number | string
  // [any: string]: any
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
 * 构造表单动态组件参数
 * sxh
 * 2023-3-14
 */
export function generateDynamicColumn(column: CommonColumn) {
  if (!column.prop) return
  const param = {
    clearable: true,
    ...column,
  }
  if (!['switch', 'radio', 'checkbox'].includes(param.type ?? '')) {
    param.style = 'width: 100%;' + param.style ?? ''
  }
  const slots = {
    ...column.slots,
  }

  // 没有默认插槽，给select，radio-group，checkbox-group初始化子选项
  if (!slots.default) {
    // 选项的通用参数
    const itemParam = {
      ...param.itemParam,
    }
    if (param.type === 'select') {
      // 下拉框option数据， ref
      const itemArr = getItemListRef(param)
      // 构造select-option
      slots.default = () => {
        return itemArr.value.map((i) => createVNode(ElOption, { ...itemParam, ...i }))
      }
    }
    if (param.type === 'radio-group') {
      // 默认加上子项的边框
      itemParam.border ??= true
      // 选项ref数据
      const itemArr = getItemListRef(param)
      // 构造单选框选项
      slots.default = () => {
        return itemArr.value.map((i) => {
          const optionParam = { ...itemParam, label: i.value }
          return createVNode(ElRadio, optionParam, () => i.label)
        })
      }
    }
    if (param.type === 'checkbox-group') {
      // 默认加上子项的边框
      itemParam.border ??= true
      // 选项ref数据
      const itemArr = getItemListRef(param)
      // 构造多选框子选项
      slots.default = () => {
        return itemArr.value.map((i) => {
          const optionParam = { ...itemParam, label: i.value }
          return createVNode(ElCheckbox, optionParam, () => i.label)
        })
      }
    }
  }

  let type: string = column.type ?? 'input'
  if (['text', 'textarea', 'password', 'number'].includes(type)) {
    type = 'el-input'
  } else if (['year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange'].includes(type)) {
    // 设置默认的格式化
    if (!param.valueFormat) {
      if (['year'].includes(type)) param.valueFormat = 'YYYY'
      // if (['dates'].includes(type)) param.valueFormat = 'YYYY'
      // if (['week'].includes(type)) param.valueFormat = 'YYYY'
      if (['date', 'daterange'].includes(type)) param.valueFormat = 'YYYY-MM-DD'
      if (['datetime', 'datetimerange'].includes(type)) param.valueFormat = 'YYYY-MM-DD HH:mm:ss'
      if (['month', 'monthrange'].includes(type)) param.valueFormat = 'YYYY-MM'
    }
    type = 'el-date-picker'
  } else if (type === 'icon') {
    type = 'm-icon-select'
  } else if (['upload-img', 'upload-file'].includes(type)) {
    type = 'm-upload'
  } else {
    type = 'el-' + type
  }

  // 日期区间需要单独处理
  if (['daterange', 'datetimerange', 'monthrange'].includes(param.type ?? '')) {
    if (!param.prop2) throw Error('prop2属性缺失')
    // 日期区间拆分独立选择
    if (param.single) {
      type = 'm-single-date-picker'
    }
  }
  const component = getFormComponentByName(type)
  return {
    component,
    param,
    slots,
  }
}

// 生成双向绑定属性值
export function vModelValue(param: CommonColumn & { prop: any; prop2: any }, form) {
  const returnParam: CommonModelParam = {}
  // 需要双向绑定
  if (form && param.prop) {
    // 日期区间需要单独处理
    if (['daterange', 'datetimerange', 'monthrange'].includes(param.type ?? '')) {
      if (!param.prop2) throw Error('prop2属性缺失')
      // 日期区间拆分独立选择
      if (param.single) {
        returnParam.start = form[param.prop]
        returnParam.end = form[param.prop2]
        returnParam['onUpdate:start'] = (val) => {
          form[param.prop] = val
        }
        returnParam['onUpdate:end'] = (val) => {
          form[param.prop2] = val
        }
      } else {
        if (form[param.prop] && form[param.prop2]) {
          returnParam.modelValue = [form[param.prop], form[param.prop2]]
        } else {
          returnParam.modelValue = null
        }
        returnParam['onUpdate:modelValue'] = (val) => {
          if (val) {
            const [value, value2] = val
            form[param.prop] = value
            form[param.prop2] = value2
          } else {
            form[param.prop] = null
            form[param.prop2] = null
          }
        }
      }
    } else {
      returnParam.modelValue = form[param.prop]
      returnParam['onUpdate:modelValue'] = (val) => {
        form[param.prop] = val
      }
    }
    return returnParam
  }
}

/**
 * 生成默认的placeholder
 */
export function generatePlaceholder(column) {
  if(!column?.prop) return
  const type = column.type ?? 'input'
  if (!Object.prototype.hasOwnProperty.call(column, 'placeholder')) {
    const label = column.label ?? ''
    if (['select', 'cascader', 'year', 'month', 'date', 'dates', 'datetime', 'week', 'icon'].includes(type)) {
      column.placeholder = '请选择' + label
    } else if (['datetimerange', 'daterange', 'monthrange'].includes(type)) {
      column.startPlaceholder = column.startPlaceholder ?? label + '起'
      column.endPlaceholder = column.endPlaceholder ?? label + '止'
    } else if (['input', 'textarea'].includes(type)) {
      column.placeholder = '请输入' + label
    }
  }
  return column
}

/**
 * 生成itemListRef数据
 */
export function getItemListRef(column: CommonColumn): Ref<CommonItemData[]> {
  // 生成方法
  const generateItemList = (data) => {
    return data.map((i) => {
      let label = i.label
      let value = i.value
      if (column.labelKey) {
        label = column.labelKey instanceof Function ? column.labelKey(i) : i[column.labelKey]
      }
      if (column.valueKey) {
        value = column.valueKey instanceof Function ? column.valueKey(i) : i[column.valueKey]
      }
      return {
        label,
        value,
      }
    })
  }
  // 下拉框option数据
  const itemArr: Ref<CommonItemData[]> = ref([])
  let itemList = toRaw(column.itemList ?? [])
  if (itemList instanceof Function) {
    itemList = itemList()
  }
  if (itemList instanceof Promise) {
    itemList.then((res) => (itemArr.value = generateItemList(res)))
  } else {
    itemArr.value = generateItemList(itemList)
  }
  return itemArr
}

/**
 * 增强el-form表单验证
 */
export function generateFormRules(column, formData?:object) {
  const rules = setRules(column)
  if (!rules) return
  column.rules = rules.map((i) => {
    return {
      required: i.required,
      validator: async (rule, value, callback) => {
        const errMsg = await ruleValid(i, value, formData, column.prop)
        if (errMsg) callback(Error(errMsg?.toString()))
        else callback()
      },
      trigger: i.trigger,
    }
  })
  return column.rules
}

/**
 * 设置一下rules
 * @param column
 */
export function setRules(column) {
  if (!column.rules) return
  let rules = column.rules
  if (!(rules instanceof Array)) {
    rules = [rules]
  }
  rules.forEach((rule) => {
    rule.label ??= column.label
  })
  column.rules = rules
  return rules
}

// 生成默认的formatter函数
export function generateFormatter(tableColumParams) {
  // itemList需要转化一下显示
  if (tableColumParams.itemList) {
    tableColumParams.formatter ??= (row, column, cellValue) => {
      const itemList = isRef(tableColumParams.itemList) ? tableColumParams.itemList.value : tableColumParams.itemList
      return itemList.find((i) => i.value === cellValue)?.label ?? cellValue
    }
  }
}

// 通过名称获取组件对象
function getFormComponentByName(compName) {
  let component: any = ElInput
  if (compName === 'el-autocomplete') component = ElAutocomplete
  if (compName === 'el-cascader') component = ElCascader
  if (compName === 'el-checkbox') component = ElCheckbox
  if (compName === 'el-checkbox-button') component = ElCheckboxButton
  if (compName === 'el-color-picker') component = ElColorPicker
  if (compName === 'el-date-picker') component = ElDatePicker
  if (compName === 'el-input-number') component = ElInputNumber
  if (compName === 'el-radio') component = ElRadio
  if (compName === 'el-radio-button') component = ElRadioButton
  if (compName === 'el-rate') component = ElRate
  if (compName === 'el-select') component = ElSelect
  if (compName === 'el-select-v2') component = ElSelectV2
  if (compName === 'el-slider') component = ElSlider
  if (compName === 'el-switch') component = ElSwitch
  if (compName === 'el-time-picker') component = ElTimePicker
  if (compName === 'el-time-select') component = ElTimeSelect
  if (compName === 'el-upload') component = ElUpload
  if (compName === 'el-radio-group') component = ElRadioGroup
  if (compName === 'el-checkbox-group') component = ElCheckboxGroup
  if (compName === 'm-single-date-picker') component = SingleDatePicker
  if (compName === 'm-icon-select') component = IconSelect
  if (compName === 'm-upload') component = MUpload
  return component
}
