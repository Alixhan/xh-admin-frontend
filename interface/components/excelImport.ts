// excel错误数据类型
import type {ImportExcelColumn} from '@i/utils/excel'

export interface ExcelError {
    // 数据行号
    num: number
    // excel行号
    excelNum: number
    // 错误内容
    error: string
}

export interface ExportExcelProps<T extends object> {
    // 导入excel列定义
    readonly columns: ImportExcelColumn<T>[]
    // 下载导出模板文件名称
    readonly templateFileName?: string
    /**
     * 验证通过数据的回调方法
     * @param {Function} callback 回调函数，可以做服务器验证，将服务器错误返回
     */
    readonly onComplete: (data: T[], callback: (err?: ExcelError[]) => void) => void
}
