<template>
  <el-button icon="Download" type="primary" text :loading="loading" @click="exportExcel"> 导出 </el-button>
</template>
<script setup lang="ts">
import { ref, unref } from 'vue'
import type { PropType } from 'vue'
import { cloneDeep } from 'lodash'
import { ElMessageBox, ElNotification } from 'element-plus'
import { ExcelTree } from '@/utils/excel'

/**
 * 通用表格导出到excel
 * sxh
 * 2023-4-2
 */
const props = defineProps({
  pageQuery: {
    type: Object as PropType<PageQuery>,
    required: true,
  },
  fetchData: {
    type: Function,
  },
  data: {
    type: Array,
  },
  columns: {
    type: Array,
    required: true,
  },
  exportFileName: {
    type: String,
    default: '导出数据.xlsx',
  },
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
        cancelButtonText: '导出全部',
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
      const excelTree = new ExcelTree(unref(props.columns))
      await excelTree.exportExcel(props.exportFileName, data)
    } finally {
      loading.value = false
    }
  } else {
    ElNotification({
      title: '导出失败',
      message: '无数据可以导出！',
      type: 'error',
    })
  }
}
</script>
<style scoped lang="scss"></style>
