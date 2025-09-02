/**
 * sxh 2023-11-10
 * 严格的类型定义有助于后期项目的维护，并能极大的提高代码可靠性
 * 表单类型定义
 */
import type { ValidRule } from '@i/utils/validate'
import type { CommonColumnType, CommonItemData, CommonItemList, SlotsObj } from '@i/components/index'
import type { FormProps } from 'element-plus'
import { formEmits, formProps } from 'element-plus'
import type { PropType, VNode } from 'vue'

/**
 * 表单列类型
 */
export declare type FormColumnType = CommonColumnType | 'separator'

/**
 * 表单处理类型
 */
export declare type FormHandleType = 'add' | 'edit' | 'detail' | string

/**
 * 通用表单column
 */
export interface CommonFormColumn<T extends object> extends Partial<Omit<FormProps, 'rules' | 'type'>> {
  //标题名称
  label?: string
  //表单类型
  type?: FormColumnType
  //隐藏此列
  hidden?: boolean
  //绑定表单的属性
  prop?: string
  // 校验规则
  rules?: ValidRule<T, keyof T> | ValidRule<T, keyof T>[]
  // 自定义渲染，参数为默认渲染的vNode
  render?: (vNode: VNode) => VNode
  //疑问备注框
  comment?: any
  //显示必填星号
  required?: boolean
  //表单项插槽
  slots?: SlotsObj
  //允许用户按照自己的slotName插槽定制
  slotName?: string
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
  //绑定表单的属性
  single?: UploadSingle | boolean
  //当column属性和表单组件属性名冲突时，可通过此属性给表单组件做覆盖配置
  $param?: {
    [prop: string]: any
  }
  [prop: string]: any
}

/**
 * 表单列类型
 */
export interface UploadFormColumn<T extends object> extends CommonFormColumn<T> {
  type: 'upload-file' | 'upload'
  //上传文件的限制数量
  limit?: number
}

export const mFormProps = {
  ...formProps,
  // 表单处理类型
  handleType: {
    type: String as PropType<FormHandleType>,
    default: 'add'
  },
  // 跨度，对应el-col
  colspan: {
    type: Number
  },
  // 表单对象
  model: {
    type: Object,
    required: true
  },
  // 表单项定义
  columns: {
    type: Array as PropType<CommonFormColumn<any>[]>,
    required: true
  },
  labelWidth: {
    type: [String, Number]
  },
  labelPosition: {
    type: String as PropType<'top' | 'left' | 'right'>
  },
  scrollToError: {
    default: true
  },
  scrollIntoViewOptions: {
    default: { behavior: 'smooth', block: 'center', inline: 'center' }
  },
  //加载状态，为true时展示骨架屏
  loading: {
    type: Boolean
  }
}

export declare type UploadSingle = 'id' | 'object'

export const mFormEmits = {
  ...formEmits
}
