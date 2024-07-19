import FileSaver from 'file-saver'
import type { Border } from 'exceljs'
import ExcelJS from 'exceljs'
import { generateFormatter, getRules } from '@/components/mutils'
import { toRaw } from 'vue'
import type { CommonExcelColumn, CommonExcelData, ExcelJsWorksheetColumn, ExcelTreeNode } from '@i/utils/excel'
import i18n from '@/i18n'

const { t } = i18n.global

/**
 * excel树,提供遍历方法和导出文件方法
 */
export class ExcelTree<T extends CommonExcelData<T>> implements ExcelTreeNode<T> {
  $row: number = 0
  $col: number = 1
  $plies: number = 0
  $maxPlies: number = 0
  $rowSpan: number = 0
  $colSpan: number = 0
  children: ExcelTreeNode<T>[]
  // 所有可用节点集合，前序排列
  readonly nodes: ExcelTreeNode<T>[]
  // 叶子节点
  readonly leafNodes: ExcelTreeNode<T>[]
  //exceljs列
  readonly excelColumns: ExcelJsWorksheetColumn[]

  /**
   * 判断无效column，不导出到excel
   */
  private invalidColumn(column: ExcelTreeNode<T>) {
    return column.notExport || column.hidden || ['operation', 'selection'].includes(column.type ?? '')
  }

  constructor(columns: CommonExcelColumn<T>[]) {
    this.children = columns.map(clone<T>)
    this.nodes = [] // 所有可用节点集合，前序排列
    const stackArray: ExcelTreeNode<T>[] = [this]
    const leafNodes: ExcelTreeNode<T>[] = [] // 叶子节点集合
    while (stackArray.length) {
      const node = stackArray[stackArray.length - 1]
      if (node.rules) node.rules = getRules({ rules: node.rules })
      if (this.invalidColumn(node)) {
        stackArray.pop()
        continue
      }
      if (!node.$flag && node !== this) this.nodes.push(node)
      if (node.children?.length) {
        node.children = node.children.filter((c) => !this.invalidColumn(c))
      }
      if (node.children?.length && !node.$flag) {
        node.$flag = true // 标识已遍历
        const $parentIndex = stackArray.length - 1
        node.children.forEach((item) => {
          item.$parentIndex = $parentIndex
          stackArray.push(item)
        })
      } else {
        stackArray.pop()
        const parentNode = stackArray[node.$parentIndex!] // 节点的父亲节点
        if (parentNode) {
          const $leafSize = node.$leafSize || 1
          parentNode.$leafSize = (parentNode.$leafSize || 0) + $leafSize // 节点的叶子节点总数
          // 父节点最大层数
          parentNode.$maxPlies = Math.max(parentNode.$maxPlies || 0, (node.$maxPlies || 1) + 1)
          if (!node.children?.length) {
            node.rules = node.rules instanceof Array ? node.rules : [node.rules || {}]
            leafNodes.unshift(node)
          }
        }
      }
    }

    // 深度非递归遍历节点，计算出节点在单元格的位置和单元格合并值
    // 将节点导入excel,生成excel导入模板
    const stackArray2: ExcelTreeNode<T>[] = [this]
    while (stackArray2.length) {
      const column = stackArray2.pop()
      const $plies = column!.$plies!
      const children = column!.children
      column!.$row = column!.$plies
      column!.$colSpan = column!.$leafSize || 1
      if (children?.length) {
        let $col = column!.$col!
        children.forEach((i) => {
          i.$plies = $plies + 1
          i.$col = $col
          $col += i.$leafSize || 1
        })
        stackArray2.push(...[...children].reverse())
      } else {
        column!.$rowSpan = this.$maxPlies - column!.$plies!
      }
    }
    // 所有叶子节点
    this.leafNodes = leafNodes
    // excel列
    this.excelColumns = leafNodes.map((i) => {
      generateFormatter(i)
      return {
        key: i.prop,
        width: Math.max(10, ~~((i.label ?? '').length * 1.65) + 4)
      }
    })
  }

  // 前序遍历方法不包含根
  public eachNode(callback: (node: ExcelTreeNode<T>) => void) {
    this.nodes.forEach(callback)
  }

  /**
   * 导出为excel文件
   */
  async exportExcel(fileName: string, data: T[]) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('sheet')
    this.eachNode((node) => {
      const cell = worksheet.getCell(node.$row, node.$col)
      cell.value = node.label
      if ((node.$colSpan > 1 || node.$rowSpan > 1) && node.$plies > 0) {
        // 按开始行，开始列，结束行，结束列合并
        worksheet.mergeCells(
          node.$row,
          node.$col,
          node.$row + (node.$rowSpan || 1) - 1,
          node.$col + (node.$colSpan || 1) - 1
        )
      }
      // 标题单元格背景色
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB3C2D2' }
      }
      // 标题单元格边框
      const border: Partial<Border> = { style: 'thin', color: { argb: 'FFA8A8A8' } }
      cell.border = {
        top: border,
        left: border,
        bottom: border,
        right: border
      }
      // 标题单元格字体
      cell.font = { bold: true, size: 9 }
      const rules = node.rules instanceof Array ? node.rules : [node.rules || {}]
      let note = ''
      if (node.note) note = node.note + ';'
      rules.forEach((i) => {
        // 必填字段标题红色
        if (i.required) {
          cell.font.color = { argb: 'FFF0000' }
        }
        // 下拉框标题单元格添加提示批注
        const itemList = toRaw(i.itemList)
        if (itemList && Array.isArray(itemList)) {
          note =
            (note ?? '') +
            t('m.form.valRestriction', {
              label: node.label ?? '',
              enums: Object.values(itemList.map((j) => j.label))
            }) +
            ';'
        }
        if (i.dateFormat) {
          note =
            (note ?? '') +
            t('m.form.formatTip', {
              label: node.label ?? '',
              format: i.dateFormat
            }) +
            ';'
        }
      })
      if (note) cell.note = note
      // 单元格标题居中
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    worksheet.columns = this.excelColumns
    // 添加表格数据
    if (data?.length) {
      const rows: any[] = []
      // 如果是层级数据，则需要平铺层级数据
      const arr = [...data]
      while (arr.length) {
        const item = arr.shift()!
        if (item?.children?.length) arr.unshift(...item.children)
        rows.push(
          this.leafNodes.map((j, index) => {
            let val = item[j.prop!]
            if (j.formatter) {
              val = j.formatter(item, j as any, val, index)
            }
            if (j.type === 'index') {
              val = j.index instanceof Function ? j.index(rows.length) : rows.length + 1
            }
            return val
          })
        )
      }
      worksheet.addRows(rows)
    }
    return workbook.xlsx.writeBuffer().then((buffer) => {
      FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx')
    })
  }
}

// 树形数据复制
function clone<T extends object>(tree: CommonExcelColumn<T>): ExcelTreeNode<T> {
  return {
    $col: 0,
    $colSpan: 0,
    $maxPlies: 0,
    $plies: 0,
    $row: 0,
    $rowSpan: 0,
    ...tree,
    children: tree.children?.length ? tree.children.map(clone) : undefined
  }
}
