import type { CommonFormColumn } from '@i/components/form'
import type { TableColumn } from '@i/components/table'

/**
 * excel列类型定义
 */
export interface CommonExcelColumn<T extends object>
  extends Omit<CommonFormColumn<T>, 'type'>,
    Pick<TableColumn<T>, 'formatter' | 'index' | 'type'> {
  //列名称
  label?: string
  // 此列不导出到excel
  notExport?: boolean
  //此列隐藏
  hidden?: boolean
  //列备注
  note?: string
  //子项
  children?: CommonExcelColumn<T>[]
}

/**
 * excel树节点类型定义
 */
export interface ExcelTreeNode<T extends object> extends CommonExcelColumn<T> {
  // excel列的宽度
  width?: number
  // 遍历时标记已遍历
  $flag?: boolean
  // 此节点的叶子节点数量
  $leafSize?: number
  // 标记excel行号
  $row: number
  // 标记excel列号
  $col: number
  // 当前节点所在树的第几层
  $plies: number
  // 此节点树的最大层数
  $maxPlies: number
  // 当前节点excel跨行数
  $rowSpan: number
  // 当前节点excel跨列数
  $colSpan: number
  // 上级索引
  $parentIndex?: number
  //子项
  children?: ExcelTreeNode<T>[]
}

/**
 * 导入excel列类型定义
 */
export interface ImportExcelColumn<T extends object = object> extends CommonExcelColumn<T> {
  //字段名
  prop: string
  //列名称
  label: string
  //子项
  children?: ImportExcelColumn<T>[]
}

/**
 * 导出excel列类型定义
 */
export interface ExportExcelColumn<T extends object> extends CommonExcelColumn<T> {
  //子项
  children?: ExportExcelColumn<T>[]
}

/**
 * exceljs column定义
 */
export interface ExcelJsWorksheetColumn {
  key?: string
  width?: number
}

/**
 * excel data类型定义
 */
export interface CommonExcelData<T extends object> {
  // 层级数据
  children?: T[]

  [key: string]: any
}
