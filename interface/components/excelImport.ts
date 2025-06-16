import type { ImportExcelColumn } from '@i/utils/excel'
import type { TableLayout } from '@i/components/table'

/**
 * excel错误数据类型
 */
export interface ExcelError {
  // 行索引
  rowIndex?: number
  // 数据行号
  num?: number
  // excel行号
  excelNum?: number
  // 错误内容
  error: string
}

export interface ExcelImportProps<T extends object> {
  // excel列定义
  readonly columns: ImportExcelColumn<T>[]
  // 下载导出模板文件名称
  readonly templateFileName?: string
  // 表格布局方式
  readonly layout?: TableLayout
  // 前端验证完成回调
  readonly onComplete: ExcelImportOnComplete<T>
  // 下载模板的初始化数据
  readonly initData?: ExcelImportInitData<T>
  // 显示提示
  readonly showHint?: boolean
  // 嵌入式的
  readonly embedded?: boolean
  // 下载模板按钮名称
  readonly downloadTemplateButtonName?: string
  // 选择文件按钮名称
  readonly selectFileButtonName?: string
}

export declare type ExcelImportOnComplete<T extends object> = (
  data: T[]
) => Promise<ExcelError[] | undefined> | ExcelError[] | undefined

export declare type ExcelImportInitData<T extends object> = T[] | (() => T[] | Promise<T[]>) | Promise<T[]>
