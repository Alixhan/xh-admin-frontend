import type { TableColumnCtx } from 'element-plus'
import type { FetchPageDataFun } from '@i/utils/request'
import type { CommonFormColumn, FormHandleType } from '@i/components/form'
import type { CommonItemData, CommonItemList, ItemListColumn, SlotRender } from '@i/components/index'
import type { ExtractPropTypes, PropType, VNode } from 'vue'
import elTablePropsDefault from 'element-plus/es/components/table/src/table/defaults.mjs'
import type { ValidRule } from '@i/utils/validate'

/**
 * 表格列类型
 */

export const mTableProps = {
  ...elTablePropsDefault,
  formType: {
    type: String as PropType<FormHandleType>,
    default: 'add'
  },
  // 如果高度随内容自动增高：则需要设置为 "auto", 如果表格高度制定了则需要设定为 "stretch"
  layout: {
    type: String as PropType<TableLayout>
  },
  // 是否是筛选过滤的表格，是：表格包含搜索框，同时布局有间距调整
  isFilterTable: {
    type: Boolean,
    default: false
  },
  // 是否导出excel
  isExportExcel: {
    type: Boolean,
    default: true
  },
  // 导出的文件名
  exportFileName: {
    type: String
  },
  // 是否表格列排序
  isSortColumn: {
    type: Boolean,
    default: true
  },
  // 是否高级筛选
  isComplexFilter: {
    type: Boolean,
    default: false
  },
  /**
   * 可选择行的表格 <multiple|single>
   */
  selection: {
    type: String as PropType<TableSelection>
  },
  /**
   * 最多可选择行数
   */
  selectionLimit: {
    type: Number
  },
  // 过滤column
  filterColumns: {
    type: Array as PropType<CommonFormColumn<any>[]>
  },
  // 过滤param
  filterParam: {
    type: Object
  },
  // 表格列定义
  columns: {
    type: Array as PropType<CommonTableColumn<any>[]>,
    default: []
  },
  // 请求后台数据的方法
  fetchData: {
    type: Function as PropType<FetchPageDataFun<any>>
  },
  // 是否默认查询，启动就查询一次
  defaultQuery: {
    type: Boolean,
    default: true
  },
  // 表格数据
  data: {
    type: Array as PropType<any[]>
  },
  // 是否分页
  isPage: {
    type: Boolean,
    default: true
  },
  // 分页对象
  pagination: {
    type: Object as PropType<TablePagination>
  },
  stripe: {
    type: Boolean,
    default: true
  }
}

/**
 * T为表格行的数据类型，F为表单数据类型
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type MTableProps<T extends object, F extends object> = ExtractPropTypes<typeof mTableProps>

// 表格列定义
export interface TableColumn<T extends object> extends Partial<Omit<TableColumnCtx<T>, 'children'>> {
  //绑定行的属性
  prop?: string
  //prop属性别名
  alias?: string
  prop2?: string
  single?: string
  type?: string
  _id?: string
  //标题名称
  label?: string
  //疑问备注框
  comment?: VNode
  //显示必填星号
  required?: boolean
  // 表格是否可编辑
  editable?: boolean
  // 此列不导出到excel
  notExport?: boolean
  // 此列隐藏
  hidden?: boolean
  // 表格编辑参数
  editParam?: CommonFormColumn<T> | ((row: T, column: TableColumn<T>) => CommonFormColumn<T>)
  //允许用户按照自己的slotName插槽定制
  slotName?: string
  // 操作列按钮
  buttons?: OperationButton<T>[]
  //选项列表
  itemList?: CommonItemList
  labelKey?: string | ((item: CommonItemData) => string | number)
  valueKey?: string | ((item: CommonItemData) => string | number)
  //按钮最大数量，超过的部分会被收纳进更多下拉选项里面
  readonly maxCount?: number
  // 当前节点数据校验规则
  rules?: ValidRule<T, keyof T> | ValidRule<T, keyof T>[]
  //选择列
  selection?: TableSelection
  //表格列插槽
  slots?: {
    default?: SlotRender
    header?: SlotRender
  }
  children?: TableColumn<T>[]
}

export interface TableSortColumn {
  _id: string
  label: string
  hidden?: boolean
  children?: TableSortColumn[]
}

export interface CI<T extends object> {
  $index: number
  column: TableColumn<T>
  row: T
}

// 通用表格分页参数对象类型
export interface TablePagination {
  // 合计值
  total?: number
  // 当前页码 分页为true时必有值
  currentPage?: number
  // 分页大小 分页为true时必有值
  pageSize?: number
  // 分页框有背景颜色，参考element-plus分页组件
  background: true
  // 显示哪些布局控件，参考element-plus分页组件
  layout: 'total,sizes,prev,pager,next,jumper' | string
}

/**
 * 表格多选类型
 */
export declare type TableSelection = 'multiple' | 'single'

/**
 * 表格布局类型, 如果高度随内容自动增高：则需要设置为 "auto", 如果表格高度制定了则需要设定为 "stretch"
 */
export type TableLayout = 'auto' | 'stretch'

export type CommonTableColumn<T extends object> =
  | TextTableColumn<T>
  | IndexTableColumn<T>
  | OperationTableColumn<T>
  | ItemListTableColumn<T>
  | SlotsTableColumn<T>
  | EditableTableColumn<T>
  | RangeEditableTableColumn<T>
  | SelectionTableColumn<T>

/**
 * 文本列
 */
export interface TextTableColumn<T extends object> extends TableColumn<T> {
  label: string
}

/**
 * 选择列
 */
export interface SelectionTableColumn<T extends object> extends TableColumn<T> {
  type: 'selection'
  //选择列
  selection?: TableSelection
}

/**
 * 索引列
 */
export interface IndexTableColumn<T extends object> extends TableColumn<T> {
  type: 'index'
  index?: (index: number) => number
}

/**
 * 操作项列表列
 */
export interface OperationTableColumn<T extends object> extends TableColumn<T> {
  type: 'operation'
  //按钮最大数量，超过的部分会被收纳进更多下拉选项里面
  readonly maxCount?: number
  // 操作列按钮
  buttons: OperationButton<T>[]
}

/**
 * 具有itemList列
 */
export interface ItemListTableColumn<T extends object> extends TableColumn<T>, ItemListColumn {
  type: 'select' | 'checkbox-group' | 'radio-group'
}

/**
 * table插槽列
 */
export interface SlotsTableColumn<T extends object> extends TableColumn<T> {
  slots?: {
    default?: SlotRender
    header?: SlotRender
  }
}

/**
 * table可编辑列
 */
export interface EditableTableColumn<T extends object> extends TableColumn<T>, ItemListColumn {
  editable: boolean
  // 表格编辑参数
  editParam?: CommonFormColumn<T> | ((row: T, column: TableColumn<T>) => CommonFormColumn<T>)
}

/**
 * table时间范围可编辑列
 */
export interface RangeEditableTableColumn<T extends object> extends EditableTableColumn<T>, ItemListColumn {
  type: 'daterange' | 'datetimerange' | 'monthrange'
  // 第二属性
  prop2: string
  //可独立选择
  single?: string
}

export interface OperationButton<T> {
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  label: string
  icon?: string
  auth?: string | string[]
  authLogic?: 'and' | 'or'
  onClick?: (row: T) => void
  disabled?: ((row: T) => boolean) | boolean
}

export interface OperationButtonProps<T> {
  readonly auth?: boolean
  readonly maxCount?: number
  readonly row?: T
  readonly buttons: OperationButton<T>[]
}

export interface FilterRow {
  type?: string
  logic: 'and' | 'or'
  checked: boolean
  prop?: string
  condition?: 'ct' | 'nct' | 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'in' | 'bt'
  value1: any
  value2?: any
  children?: FilterRow[]
}

export interface QueryFilterProps {
  //是否递归搜索条件
  recursive?: boolean
}

export interface QueryFilter {
  recursive: boolean
  filters: FilterRow[]
  enabledFilters: FilterRow[]
  addRow: (prop: string, parent?: FilterRow) => void
  removeRow: (index: number, parent?: FilterRow) => void
}

export interface PreviewType extends Omit<FilterRow, 'children'> {
  alias?: string
  enabled: boolean
  str: string
  children?: PreviewType[]
}
