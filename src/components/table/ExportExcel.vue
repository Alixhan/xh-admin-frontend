<template>
  <el-button icon="Download" type="primary" text :loading="loading" @click="exportExcel"> {{ $t("m.table.export") }}
  </el-button>
</template>
<script setup lang="ts">
import { ref, unref } from 'vue'
import type { PropType } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { ExcelTree } from '@/utils/excel'
import type { TableColumn } from '@/components/table/index.vue'
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n'

/**
 * 通用表格导出到excel
 * sxh
 * 2023-4-2
 */
const props = defineProps({
  pageQuery: {
    type: Object as PropType<PageQuery>,
    required: true
  },
  fetchData: {
    type: Function
  },
  data: {
    type: Array
  },
  columns: {
    type: Array as PropType<Array<TableColumn>>,
    required: true
  },
  exportFileName: {
    type: String
  }
})

const loading = ref(false)

const { t } = useI18n()

async function exportExcel() {
  const pageQuery = cloneDeep!(props.pageQuery)
  pageQuery.isExport = true // 标识为导出请求
  let data = props.data
  if (props.fetchData) {
    if (props.pageQuery.isPage) {
      const r = await ElMessageBox.confirm(t('m.table.exportConfirm'), t('common.tip'), {
        distinguishCancelAndClose: true,
        confirmButtonText: t('m.table.exportCurrent'),
        cancelButtonText: t('m.table.exportAll')
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
      await excelTree.exportExcel(props.exportFileName ?? t('m.table.fileName') + '.xlsx', data)
    } finally {
      loading.value = false
    }
  } else {
    ElNotification({
      title: t('m.table.exportFail'),
      message: t('m.table.exportNoData'),
      type: 'error'
    })
  }
}
</script>
<style scoped lang="scss"></style>
