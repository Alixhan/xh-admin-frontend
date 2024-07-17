// excel错误数据类型
import type { ImportExcelColumn } from '@i/utils/excel'
import type {TableLayout} from '@i/components/table'

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
  //表格布局方式
  readonly layout?: TableLayout,
  /**
   * 验证通过数据的回调方法
   * @param {Function} callback 回调函数，可以做服务器验证，将服务器错误返回
   */
  readonly onComplete: ExcelImportOnComplete<T>
  // 下载模板的初始化数据
  readonly initData?: ExcelImportInitData<T>
}

export declare type ExcelImportOnComplete<T extends object> = (data: T[], callback: (err?: ExcelError[]) => void) => void

export declare type ExcelImportInitData<T extends object> = T[] | (() => T[] | Promise<T[]>) | Promise<T[]>
