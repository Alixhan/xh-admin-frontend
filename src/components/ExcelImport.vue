<template>
  <div class="excel-import-view">
    <input ref="fileRef" type="file" accept=".xlsx" style="display: none" @change="handleFile" />
    <template v-if="embedded">
      <slot name="embedded">
        <el-button
          v-if="showHint && tipObj.msg"
          :loading="loading"
          text
          :icon="tipObj.icon"
          :style="{ color: tipObj.color }"
          @click="tipClick"
        >
          <span>{{ tipObj.msg }}</span>
        </el-button>
        <el-button :loading="downloadLoading" type="primary" icon="download" @click="downloadTemplate()">
          {{ downloadTemplateButtonName ?? $t('m.excelImport.downloadTemplate') }}
        </el-button>
        <el-button :loading="loading" type="primary" icon="upload" @click="fileRef.click()">
          {{ selectFileButtonName ?? $t('m.excelImport.label') }}
        </el-button>
      </slot>
    </template>
    <template v-else>
      <div class="el-text tip-view">
        <slot name="tip" />
      </div>
      <m-table
        class="m-table"
        :columns="tableColumns"
        v-model:data="importData"
        :layout="layout"
        :is-export-excel="false"
      >
        <template #right-action>
          <el-button
            v-if="showHint && tipObj.msg"
            :loading="loading"
            text
            :icon="tipObj.icon"
            :style="{ color: tipObj.color }"
            @click="tipClick"
          >
            <span>{{ tipObj.msg }}</span>
          </el-button>
          <el-button :loading="downloadLoading" type="primary" icon="download" @click="downloadTemplate()">
            {{ downloadTemplateButtonName ?? $t('m.excelImport.downloadTemplate') }}
          </el-button>
          <el-button :loading="loading" type="primary" icon="folderOpened" @click="fileRef.click()">
            {{ selectFileButtonName ?? $t('m.form.selectFile') }}
          </el-button>
          <el-button :loading="loading" type="primary" icon="check" @click="subImport">
            {{ $t('m.excelImport.confirmImport') }}
          </el-button>
          <el-button :loading="loading" type="danger" icon="delete" @click="clear">{{ $t('common.clear') }}</el-button>
        </template>
      </m-table>
    </template>
    <el-dialog :title="$t('common.errorMsg')" v-model="errorVisible" align-center draggable append-to-body width="70%">
      <m-table
        ref="errorRef"
        :columns="errorTableColumns"
        v-model:data="errorData"
        :cell-style="cellStyle"
        style="height: 70vh"
        :export-file-name="$t('common.errorMsg')"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts" generic="T extends object">
import MTable from '@/components/table/index.vue'
import type { Ref } from 'vue'
import { computed, ref, unref, watchEffect } from 'vue'
import { ExcelTree } from '@/utils/excel'
import ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import type { ValidResult } from '@i/utils/validate'
import validate from '@/utils/validate'
import type { TableColumn } from '@i/components/table'
import type { ExcelError, ExcelImportInitData, ExcelImportProps } from '@i/components/excelImport'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'MExcelImport'
})

const { t } = useI18n()

const props = withDefaults(defineProps<ExcelImportProps<T>>(), { showHint: true })

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
  status?: '' | 'success' | 'error' | 'exception'
}>({
  step: '',
  msg: '',
  status: ''
})

const tipObj = computed(() => {
  const steps = {
    1: { do: t('m.excelImport.step1Do'), error: t('m.excelImport.step1Error') },
    2: {
      do: t('m.excelImport.step2Do'),
      error: t('m.excelImport.step2Error'),
      success: t('m.excelImport.step2Success')
    },
    3: {
      do: t('m.excelImport.step3Do'),
      error: t('m.excelImport.step3Error'),
      success: t('m.excelImport.step3Success'),
      exception: t('m.excelImport.step3Error')
    },
    4: {
      do: t('m.excelImport.step4Do'),
      error: t('m.excelImport.step4Error'),
      success: t('m.excelImport.step4Success'),
      exception: t('m.excelImport.step4Exception')
    },
    5: { do: t('m.excelImport.step5Do'), success: t('m.excelImport.step5Success') }
  }
  const obj = {
    msg: steps[tip.value.step!]?.[tip.value.status || 'do'] ?? '',
    icon: '',
    color: ''
  }
  if (tip.value.status === 'success') {
    obj.icon = 'CircleCheck'
    obj.color = 'green'
  }
  if (tip.value.status === 'error') {
    obj.icon = 'CircleClose'
    obj.color = 'red'
  }
  if (tip.value.status === 'exception') {
    obj.icon = 'WarnTriangleFilled'
    obj.color = 'red'
  }
  return obj
})

// 初始化表格列定义
function initTableColumn() {
  tableColumns.value = [
    {
      type: 'index'
    },
    ...props.columns
  ]
  excelTree = new ExcelTree(unref(props.columns))
}

const fileRef = ref()

// 错误信息表格定义
const errorTableColumns: Ref<TableColumn<ExcelError>[]> = computed(() => [
  { type: 'index' },
  {
    prop: 'num',
    label: t('m.excelImport.num'),
    width: 120,
    formatter: (row, col, val) => val ?? (row.rowIndex === null || row.rowIndex === undefined ? '' : row.rowIndex + 1)
  },
  {
    prop: 'excelNum',
    label: t('m.excelImport.excelNum'),
    width: 120,
    formatter: (row, col, val) =>
      val ?? (row.rowIndex === null || row.rowIndex === undefined ? '' : row.rowIndex + (excelTree.$maxPlies ?? 1))
  },
  { prop: 'error', label: t('common.errorMsg') }
])

/**
 * 模板下载
 * 下载模板之前可以预插入一些示例数据
 */
async function downloadTemplate() {
  try {
    downloadLoading.value = true
    let data: T[] = []
    if (props.initData) {
      let arr: ExcelImportInitData<T> = props.initData
      if (arr instanceof Function) arr = arr()
      if (arr instanceof Promise) arr = await arr
      data = arr
    }
    await excelTree.exportExcel(props.templateFileName ?? t('m.excelImport.templateFileName'), data)
  } finally {
    downloadLoading.value = false
  }
}

// 处理选择文件事件
function handleFile(e: Event) {
  errorData.value = []
  const input: HTMLInputElement = e.target as HTMLInputElement
  const files = input.files!
  loading.value = true
  tip.value.step = '1'
  tip.value.status = ''
  const file = files[0]
  const reader = new FileReader()
  reader.onload = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      tip.value.step = '2'
      await workbook.xlsx.load(reader.result as any)
      const worksheet = workbook.getWorksheet(1)
      if (!worksheet) throw new Error(t('m.excelImport.templateMismatch'))
      let flag = true // 模板匹配
      excelTree.eachNode((node) => {
        const cell = worksheet.getCell(node.$row, node.$col)
        if (cell.value !== node.label) flag = false // 模板不匹配
      })
      if (!flag) throw new Error(t('m.excelImport.templateMismatch'))
      worksheet.columns = excelTree.excelColumns
      const datas: T[] = []
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > excelTree.$maxPlies - 1) {
          const rowData: any = {}
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
              cellValue = dayjs(cellValue).locale('zh-cn').format(formatPattern)
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
      if (props.embedded) await subImport()
    } catch (e: any) {
      console.error('excel handle error', e)
      tip.value.status = 'error'
      ElMessage.error(e.message ?? t('common.importsFailed'))
    } finally {
      loading.value = false
      input.value = ''
    }
  }
  reader.readAsArrayBuffer(file)
}

/**
 * 数据验证
 */
async function validData() {
  const data = importData.value.map((item) => Object.assign({}, item))
  const dataArr: T[] = [...data]
  const rowPromiseArr: ValidResult<T>[] = []
  while (dataArr.length) {
    const row = dataArr.shift()
    rowPromiseArr.push(await validate(row!, excelTree.leafNodes))
  }
  return Promise.all(rowPromiseArr).then((result: Array<ValidResult<T>>) => {
    errorData.value = []
    result.forEach((i, rowIndex) => {
      if (i.error) {
        errorData.value.push({
          rowIndex,
          num: rowIndex + 1,
          excelNum: rowIndex + (excelTree.$maxPlies ?? 0),
          error: i.errFields.map((i) => i.errMsg).join('；')
        })
      }
    })
    if (errorData.value.length) {
      errorVisible.value = true
      return Promise.reject(errorData.value)
    }
  })
}

async function subImport() {
  // 确认导入
  if (importData.value.length < 1) return ElMessage.warning(t('m.excelImport.noData'))
  loading.value = true
  tip.value.step = '3'
  tip.value.status = ''
  errorData.value = []

  try {
    // 前端验证
    await validData()

    // 后端验证
    tip.value.step = '4'
    let res = props.onComplete(importData.value)
    if (res instanceof Promise) res = await res
    if (res) {
      tip.value.status = 'error'
      errorVisible.value = true
      errorData.value = res
    } else {
      tip.value.status = 'success'
    }
  } catch (e) {
    console.error(e)
    tip.value.status = 'exception'
  } finally {
    loading.value = false
  }
}

// 设置单元格样式
function cellStyle({ column }) {
  if (column.property === 'error') {
    return {
      color: 'red'
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

const errorRef = ref()

/**
 * 导出错误信息到excel
 */
function exportError() {
  errorRef.value.exportExcelRef.exportExcel()
}

// 暴露组件方法
defineExpose({
  downloadTemplate,
  validData,
  subImport,
  exportError
})
</script>
<style scoped lang="scss">
.excel-import-view {
  white-space: nowrap;

  .tip-view {
    align-self: start;
    margin-bottom: 5px;
  }

  .m-table {
    flex-grow: 1;
  }
}
</style>
