<template>
  <div class="root">
    <m-table
        class="m-table"
        ref="tableRef"
        is-filter-table
        row-key="id"
        :filter-param="filterParam"
        :filter-columns="topFilterColumns"
        :columns="columns"
        :fetch-data="queryFileList"
        @selection-change="rows => selectRows = rows"
        v-model:data="data"
        :cell-style="cellStyle"
    >
      <template #left-action>
      </template>
      <template #right-action>
        <el-button v-auth="'del'" type="danger" icon="delete" :disabled="selectRows.length === 0" @click="del(selectRows)">删除</el-button>
      </template>
    </m-table>
    <el-dialog :title="formTitle[handleType]" v-model="formVisible" align-center draggable
               destroy-on-close :close-on-click-modal="false" width="70%">
      <file-form :handle-type="handleType" :model-value="row" style="height: 75vh;" @close="close"/>
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { delFileByIds, queryFileList } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
import FileForm from './fileForm.vue'
import { auth } from '@/directive'
import { join } from '@/utils/arrays'
import { filesize } from 'filesize'
import { getDownloadFileUrl } from '@/utils'

const formTitle = {
  edit: '文件编辑',
  detail: '文件明细',
}

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'object', label: '对象存储key' },
  { prop: 'name', label: '文件名称' },
  { prop: 'contentType', label: '文件类型' },
  { prop: 'suffix', label: '文件扩展名' },
  { prop: 'sha1', label: '文件摘要sha1' },
])

const columns = ref([
  { type: 'selection', width: 50 },
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'name', label: '原文件名' },
  { prop: 'object', label: '对象存储key', width: 150 },
  { prop: 'contentType', label: '文件类型', comment: '文件的MIME类型', width: 100 },
  { prop: 'suffix', label: '文件后缀扩展名', width: 120 },
  { prop: 'size', label: '文件大小', formatter: (row, col, val) => filesize(val, { base: 2, standard: 'jedec' }), },
  { prop: 'url', label: '图片预览', slots: { default: previewImage } },
  { prop: 'imgWidth', label: '图片宽度' },
  { prop: 'imgHeight', label: '图片高度' },
  { prop: 'imgRatio', label: '图片宽高比', width: 100 },
  { prop: 'status', label: '文件状态', type: 'select', itemList: statusList },
  { prop: 'createTime', label: '上传时间', type: 'datetime', width: 155 },
])

const delAuth = auth('del')
const editAuth = auth('edit')
const detailAuth = auth('detail')
// 添加操作栏
if (delAuth || editAuth || detailAuth) {
  let width = 46 * ((delAuth ? 1 : 0) + (editAuth ? 1 : 0) + (detailAuth ? 1 : 0))
  if (width < 50) width = 50
  columns.value.unshift({
    label: '操作',
    fixed: 'right',
    width,
    notExport: true,
    slots: {
      default (scope) {
        const arr = []
        if (editAuth) {
          arr.push(
            <el-link type="primary" underline={false} onClick={() => openForm('edit', scope.row)}>编辑</el-link>
          )
        }
        if (detailAuth) {
          arr.push(
            <el-link type="primary" underline={false} onClick={() => openForm('detail', scope.row)}>明细</el-link>
          )
        }
        if (delAuth) {
          arr.push(
            <el-link type="danger" underline={false} onClick={() => del([scope.row])}>删除</el-link>
          )
        }
        // 添加分隔符
        return join(arr, <el-divider direction="vertical"/>)
      }
    }
  })
}

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm (type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del (rows) {
  delFileByIds(rows.map(i => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    confirmMsg: '确认删除吗？此操作会删除实际文件。'
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

// 图片文件预览
function previewImage (scope) {
  const file = scope.row
  if (file.contentType.startsWith('image')) {
    const src = getDownloadFileUrl(file.object, true)
    return <el-image {...{
      src,
      style: 'width: 30px; height: 30px;',
      fit: 'cover',
      previewSrcList: [getDownloadFileUrl(file.object)],
      hideOnClickModal: true,
      previewTeleported: true,
    }} />
  }
}

function cellStyle ({ row, column }) {
  if (column.property === 'status' && row.status === 1) {
    return {
      color: 'green'
    }
  }
}

function close (type) {
  formVisible.value = false
  if (type === 'refresh') {
    tableRef.value.fetchQuery()
  }
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}

:deep(.el-image) {
  display: block;
}
</style>
