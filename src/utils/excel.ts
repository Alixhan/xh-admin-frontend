import FileSaver from 'file-saver'
import ExcelJS from 'exceljs'
import { generateFormatter, setRules } from '@/components/mutils'
import type { ValidRule } from '@/utils/validate'
import type { Border } from 'exceljs'
import { toRaw } from 'vue'

// excel列定义
export interface ExcelColumn {
  prop?: string
  // 列标题
  label?: string
  // 列的prop
  key?: string
  // 列的宽度
  width?: number
  // 此列不导出到excel
  notExport?: boolean
  // 此列隐藏
  hidden?: boolean
  // 遍历时标记已遍历
  $flag?: boolean
  // 此节点的叶子节点数量
  $leafSize?: number
  // 次节点树的最大层数
  $maxPlies?: number
  // 标记excel行号
  $row?: number
  // 标记excel列号
  $col?: number
  // 当前节点所在树的第几层
  $plies?: number
  // 当前节点excel跨行数
  $rowSpan?: number
  // 当前节点excel跨列数
  $colSpan?: number
  // 子节点
  children?: ExcelColumn[]
  // 当前节点数据校验规则
  rules?: ValidRule | ValidRule[]
  // excel导出内容格式化函数
  formatter?: Function
  // table的序号格式化函数
  index?: Function
  [prop: string]: any
}

/**
 * excel树,提供遍历方法和导出文件方法
 */
export class ExcelTree implements ExcelColumn {
  $row: number = 0
  $col: number = 1
  $plies: number = 0
  $maxPlies: number = 0
  children: ExcelColumn[]
  // 所有可用节点集合，前序排列
  readonly nodes: ExcelColumn[]
  readonly excelColumns: ExcelColumn[]
  readonly leafNodes: ExcelColumn[]

  /**
   * 判断无效column，不导出到excel
   */
  private invalidColumn(column: ExcelColumn) {
    return column.notExport || column.hidden || ['operation', 'selection'].includes(column.type)
  }

  constructor(columns) {
    this.children = columns.map(clone)
    this.nodes = [] // 所有可用节点集合，前序排列
    const stackArray: ExcelColumn[] = [this]
    const leafNodes: ExcelColumn[] = [] // 叶子节点集合
    while (stackArray.length) {
      const node = stackArray[stackArray.length - 1]
      setRules(node)
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
    const stackArray2: ExcelColumn[] = [this]
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
        width: Math.max(10, ~~((i.label ?? '').length * 1.65) + 4),
      }
    })
  }

  // 前序遍历方法不包含根
  public eachNode(callback) {
    this.nodes.forEach(callback)
  }

  /**
   * 导出为excel文件
   */
  exportExcel(fileName, data) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('sheet')
    this.eachNode((node) => {
      const cell = worksheet.getCell(node.$row, node.$col)
      cell.value = node.label
      if ((node.$colSpan > 1 || node.$rowSpan > 1) && node.$plies > 0) {
        // 按开始行，开始列，结束行，结束列合并
        worksheet.mergeCells(node.$row, node.$col, node.$row + (node.$rowSpan || 1) - 1, node.$col + (node.$colSpan || 1) - 1)
      }
      // 标题单元格背景色
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB3C2D2' },
      }
      // 标题单元格边框
      const border: Partial<Border> = { style: 'thin', color: { argb: 'FFA8A8A8' } }
      cell.border = {
        top: border,
        left: border,
        bottom: border,
        right: border,
      }
      // 标题单元格字体
      cell.font = { bold: true, size: 9 }
      const rules = node.rules instanceof Array ? node.rules : [node.rules || {}]
      rules.forEach((i) => {
        // 必填字段标题红色
        if (i.required) {
          cell.font.color = { argb: 'FFF0000' }
        }
        // 下拉框标题单元格添加提示批注
        let itemList = toRaw(i.itemList)
        if (Array.isArray(itemList)) {
          itemList = itemList.map((j) => j.label)
        }
        if (itemList) {
          cell.note = `${node.label}值只能为（${Object.values(itemList)}）。`
        }
        if (i.dateFormat) {
          cell.note = `${node.label}格式为${i.dateFormat}。`
        }
      })
      // 单元格标题居中
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    worksheet.columns = this.excelColumns
    // 添加表格数据
    if (data) {
      const rows: any[] = []
      // 如果是层级数据，则需要平铺层级数据
      const arr = [...data]
      while (arr.length) {
        const item = arr.shift()
        if (item.children?.length) arr.unshift(...item.children)
        rows.push(
          this.leafNodes.map((j) => {
            let val = item[j.prop!]
            if (j.formatter) {
              val = j.formatter(item, j, val)
            }
            if (j.type === 'index') {
              val = j.index?.(rows.length) ?? rows.length + 1
            }
            return val
          })
        )
      }
      worksheet.addRows(rows)
    }
    return workbook.xlsx.writeBuffer().then((buffer) => {
      FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName)
    })
  }
}

// 树形数据复制
function clone(tree) {
  const obj = { ...tree }
  if (tree.children?.length) {
    tree.children = tree.children.map(clone)
  }
  return obj
}
