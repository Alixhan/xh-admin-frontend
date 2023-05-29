<template>
  <el-button icon="Download" type="primary" text :loading="loading" @click="exportExcel">
    导出
  </el-button>
</template>

<script setup>
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import FileSaver from 'file-saver'
import ExcelJS from 'exceljs'
import { ElMessageBox, ElNotification } from 'element-plus'
import { generateFormatter } from '@/components/mutils'
// import ExcelJS from 'exceljs/dist/exceljs'

/**
 * 通用表格导出到excel
 * sxh
 * 2023-4-2
 */
const props = defineProps({
  pageQuery: {
    type: Object,
    required: true
  },
  fetchData: {
    type: Function
  },
  data: {
    type: Array
  },
  columns: {
    type: Array,
    required: true
  },
  exportFileName: {
    type: String,
    required: '导出数据.xlsx'
  }
})

const loading = ref(false)

async function exportExcel() {
  const pageQuery = cloneDeep(props.pageQuery)
  pageQuery.isExport = true // 标识为导出请求
  let data = props.data
  if (props.fetchData) {
    if (props.pageQuery.isPage) {
      const r = await ElMessageBox.confirm('确认导出?', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '导出当页',
        cancelButtonText: '导出全部'
      }).catch((e) => {
        pageQuery.isPage = false
        return e
      })
      if (r === 'close') return
    }
    data = await props.fetchData(pageQuery, { loadingRef: loading }).then((res) => {
      return res.data.list
    })
  }

  if (data?.length) {
    try {
      loading.value = true
      const excelTree = new ExcelTree(props.columns)
      await excelTree.exportExcel(props.exportFileName, data)
    } finally {
      loading.value = false
    }
  } else {
    ElNotification({
      title: '导出失败',
      message: '无数据可以导出！',
      type: 'error'
    })
  }
}

/**
 * excel树,提供遍历方法和导出文件方法
 */
class ExcelTree {
  constructor(columns) {
    this.children = [...columns]
    this.nodes = [] // 所有可用节点集合，前序排列
    const stackArray = [this]
    const leafNodes = [] // 叶子节点集合
    while (stackArray.length) {
      const node = stackArray[stackArray.length - 1]
      // 不导出到excel
      if (node.notExport || node.hidden) {
        stackArray.pop()
        continue
      }
      if (!node.$flag && node !== this) this.nodes.push(node)
      if (node.children?.length) {
        node.children = node.children.filter((c) => !(c.notExport || c.hidden))
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
        const parentNode = stackArray[node.$parentIndex] // 节点的父亲节点
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
    this.$row = 0
    this.$col = 1
    this.$plies = 0
    const stackArray2 = [this]
    while (stackArray2.length) {
      const column = stackArray2.pop()
      const $plies = column.$plies
      const children = column.children
      column.$row = column.$plies
      column.$colSpan = column.$leafSize || 1
      if (children?.length) {
        let $col = column.$col
        children.forEach((i) => {
          i.$plies = $plies + 1
          i.$col = $col
          $col += i.$leafSize || 1
        })
        stackArray2.push(...[...children].reverse())
      } else {
        column.$rowSpan = this.$maxPlies - column.$plies
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
  eachNode(callback) {
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
      const border = { style: 'thin', color: { argb: 'FFA8A8A8' } }
      cell.border = {
        top: border,
        left: border,
        bottom: border,
        right: border
      }
      // 标题单元格字体
      cell.font = { bold: true, size: 9 }
      const rules = node.rules instanceof Array ? node.rules : [node.rules || {}]
      rules.forEach((i) => {
        // 必填字段标题红色
        if (i.required) {
          cell.font.color = { argb: 'FFFF0000' }
        }
        // 下拉框标题单元格添加提示批注
        let itemList = i.itemList
        if (Array.isArray(itemList)) {
          itemList = itemList.map((j) => j.text)
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
      const rows = []
      // 如果是层级数据，则需要平铺层级数据
      const arr = [...data]
      while (arr.length) {
        const item = arr.shift()
        if (item.children?.length) arr.unshift(...item.children)
        rows.push(
          this.leafNodes.map((j) => {
            let val = item[j.prop]
            if (j.formatter) {
              val = j.formatter(item, j, val)
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
</script>
<style scoped lang="scss"></style>
