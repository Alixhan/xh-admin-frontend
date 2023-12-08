<template>
  <div class="excel-import-view">
    <div style="margin-bottom: 10px">
      <slot name="tip" />
    </div>
    <input ref="fileRef" type="file" accept=".xlsx, .xls" style="display: none" @change="handleFile" />
    <m-table class="m-table" :columns="tableColumns" v-model:data="importData" :is-export-excel="false">
      <template #right-action>
        <el-button :loading="loading" text :icon="tipObj.icon" :style="{ color: tipObj.color }" @click="tipClick">
          <span>{{ tipObj.msg }}</span>
        </el-button>
        <el-button :loading="downloadLoading" type="primary" icon="download" @click="downloadTemplate()"
          >下载模板
        </el-button>
        <el-button :loading="loading" type="primary" icon="folderOpened" @click="fileRef.click()">选择文件</el-button>
        <el-button :loading="loading" type="primary" icon="check" @click="subImport">确认导入</el-button>
        <el-button :loading="loading" type="danger" icon="delete" @click="clear">清空</el-button>
      </template>
    </m-table>
    <el-dialog title="错误信息" v-model="errorVisible" align-center draggable append-to-body width="70%">
      <m-table :columns="errorTableColumns" v-model:data="errorData" :cell-style="cellStyle" style="height: 70vh" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts" generic="T extends object">
import MTable from '@/components/table/index.vue'
import {computed, ref, unref, watchEffect} from 'vue'
import type {Ref} from 'vue'
import {ExcelTree} from '@/utils/excel'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import {ElMessage} from 'element-plus'
import type {RuleObject, ValidResult} from '@i/utils/validate'
import validate from '@/utils/validate'
import type {TableColumn} from '@i/components/table'
import type {ExcelError, ExportExcelProps} from '@i/components/excelImport'

defineOptions({
  name: 'MExcelImport',
})

const props = withDefaults(defineProps<ExportExcelProps<T>>(), {
  templateFileName: '导入模板.xlsx',
})

// 导入的excel数据
const importData: Ref<T[]> = ref([])
// 下载模板loading
const downloadLoading = ref(false)
// 下载模板loading
const loading = ref(false)
// 验证的错误信息
const errorData: Ref<ExcelError[]> = ref([])
// error弹框
const errorVisible = ref(false)

let excelTree: ExcelTree<T>
// 表格列定义
const tableColumns: Ref<CommonTableColumn<T>[]> = ref([])
watchEffect(initTableColumn)

const tip = ref<{
  step?: '' | '1' | '2' | '3' | '4' | '5'
  msg?: string
  status?: '' | 'success' | 'error'
}>({
  step: '',
  msg: '',
  status: '',
})

const tipObj = computed(() => {
  const steps = {
    1: { do: '导入excel', error: '导入excel文件失败' },
    2: { do: '解析excel', error: '解析excel失败', success: '解析excel成功' },
    3: { do: '验证数据中', error: '验证数据有误', success: '验证数据成功' },
    4: { do: '数据导入中', error: '导入失败（服务器校验未通过）', success: '数据导入成功' },
    5: { do: '清空中', success: '清空成功' },
  }
  const obj = {
    msg: steps[tip.value.step!]?.[tip.value.status || 'do'] ?? '',
    icon: '',
    color: '',
  }
  if (tip.value.status === 'success') {
    obj.icon = 'CircleCheck'
    obj.color = 'green'
  }
  if (tip.value.status === 'error') {
    obj.icon = 'CircleClose'
    obj.color = 'red'
  }
  return obj
})

// 初始化表格列定义
function initTableColumn() {
  tableColumns.value = [
    {
      type: 'index',
    },
    ...props.columns,
  ]
  excelTree = new ExcelTree(unref(props.columns))
}

const fileRef = ref()

// 错误信息表格定义
const errorTableColumns: TableColumn<ExcelError>[] = [
  { type: 'index' },
  { prop: 'num', label: '数据行号', width: 100 },
  {
    prop: 'excelNum',
    label: 'excel行号',
    width: 100,
    formatter: (row, col, val) => val ?? (row.num ? row.num + (excelTree.$maxPlies ?? 0) : ''),
  },
  { prop: 'error', label: '错误内容' },
]

/**
 * 模板下载
 * @param data 下载模板之前可以预插入一些数据，可以插入一些示例数据
 */
async function downloadTemplate(data = []) {
  try {
    downloadLoading.value = true
    await excelTree.exportExcel(props.templateFileName, data)
  } finally {
    downloadLoading.value = false
  }
}

// 处理选择文件事件
function handleFile(e) {
  const files = e.target.files
  loading.value = true
  tip.value.step = '1'
  tip.value.status = ''
  const file = files[0]
  const reader = new FileReader()
  reader.onload = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      tip.value.step = '2'
      // @ts-ignore
      await workbook.xlsx.load(reader.result)
      const worksheet = workbook.getWorksheet(1)
      if(!worksheet) throw new Error('模板不匹配')
      let flag = true // 模板匹配
      excelTree.eachNode((node) => {
        const cell = worksheet.getCell(node.$row, node.$col)
        if (cell.value !== node.label) flag = false // 模板不匹配
      })
      if (!flag) throw new Error('模板不匹配')
      worksheet.columns = excelTree.excelColumns
      const datas: any[] = []
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > excelTree.$maxPlies - 1) {
          const rowData = {}
          excelTree.leafNodes.forEach((c, index) => {
            const cell = row.getCell(index + 1)
            let cellValue = cell.value ?? ''
            if (cellValue instanceof Date) {
              let formatPattern = 'YYYY-MM-DD'
              if (c.rules) {
                const rules = c.rules instanceof Array ? c.rules : [c.rules]
                rules.forEach((ru) => {
                  formatPattern = ru.dateFormat ?? formatPattern
                })
              }
              cellValue = dayjs(new Date(cellValue.getTime() - 8 * 60 * 60 * 1000)).format(formatPattern)
            } else {
              cellValue = cell.text.trim()
            }
            rowData[c.prop!] = cellValue
          })
          datas.push(rowData)
        }
      })
      importData.value = datas
      tip.value.status = 'success'
    } catch (e: any) {
      tip.value.status = 'error'
      ElMessage.error(e.message ?? '导入失败')
    } finally {
      loading.value = false
      e.target.value = ''
    }
  }
  reader.readAsBinaryString(file)
}

/**
 * 数据验证
 */
async function validData() {
  const data = importData.value.map((item) => Object.assign({}, item))
  const ruleObject: RuleObject<T> = excelTree.leafNodes.reduce<RuleObject<T>>((a, b) => {
    b.rules && (a[b.prop!] = {
      prop: b.prop as keyof T,
      label: b.label,
      rules: b.rules
    })
    return a
  }, {})
  const dataArr: any[] = [...data]
  const rowPromiseArr: ValidResult<T>[] = []
  while (dataArr.length) {
    const row = dataArr.shift()
    rowPromiseArr.push(await validate(row, ruleObject))
  }
  return Promise.all(rowPromiseArr).then((result: Array<ValidResult<T>>) => {
    errorData.value = []
    result.forEach((i, num) => {
      if (i.error) {
        errorData.value.push({
          num: num + 1,
          excelNum: num + (excelTree.$maxPlies ?? 0),
          error: i.errFields.map((i) => i.errMsg).join('；'),
        })
      }
    })
    if (errorData.value.length) {
      errorVisible.value = true
      return Promise.reject(errorData.value)
    }
  })
}

function subImport() {
  // 确认导入
  if (importData.value.length < 1) return ElMessage.warning('没有数据可以导入！')
  loading.value = true
  tip.value.step = '3'
  tip.value.status = ''
  errorData.value = []
  validData()
    .then(() => {
      tip.value.step = '4'
      props.onComplete(importData.value, (error) => {
        loading.value = false
        if (error) {
          tip.value.status = 'error'
          errorVisible.value = true
          errorData.value = error
        } else {
          tip.value.status = 'success'
        }
      })
    })
    .catch(() => {
      tip.value.status = 'error'
      loading.value = false
    })
}

// 设置单元格样式
function cellStyle({ column }) {
  if (column.property === 'error') {
    return {
      color: 'red',
    }
  }
}

function tipClick() {
  if (errorData.value.length) errorVisible.value = true
}

function clear() {
  tip.value.status = 'success'
  tip.value.step = '5'
  importData.value = []
  errorData.value = []
}

// 暴露组件方法
defineExpose({
  downloadTemplate,
  validData,
  subImport,
})
</script>
<style scoped>
.excel-import-view {
  display: flex;
  flex-direction: column;
  width: 100%;

  .m-table {
    flex-grow: 1;
  }
}
</style>
