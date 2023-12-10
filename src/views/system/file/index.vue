<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      selection="multiple"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryFileList"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
      :cell-style="cellStyle"
    >
      <template #right-action>
        <el-button
          v-auth="'system:file:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >删除
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="formTitle[handleType]"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      width="60%"
      append-to-body
    >
      <file-form :handle-type="handleType" :model-value="row" style="height: 550px" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { delFileByIds, queryFileList } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
import FileForm from './fileForm.vue'
import { filesize } from 'filesize'
import { getDownloadFileUrl } from '@/utils'

const formTitle = {
  edit: '文件编辑',
  detail: '文件明细'
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
  { prop: 'sha1', label: 'sha1' }
])

const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'name', label: '原文件名' },
  { prop: 'object', label: '对象存储key', width: 150 },
  {
    prop: 'contentType',
    label: '文件类型',
    comment: '文件的MIME类型',
    width: 100
  },
  { prop: 'suffix', label: '文件后缀扩展名', width: 120 },
  {
    prop: 'size',
    label: '文件大小',
    formatter: (row, col, val) => filesize(val, { base: 2, standard: 'jedec' })
  },
  { prop: 'url', label: '图片预览', slots: { default: previewImage } },
  { prop: 'imgWidth', label: '图片宽度' },
  { prop: 'imgHeight', label: '图片高度' },
  { prop: 'imgRatio', label: '图片宽高比', width: 100 },
  {
    prop: 'status',
    label: '文件状态',
    slots: {
      default: (scope) => {
        return (
          <el-tag type={scope.row.status === 1 ? 'success' : 'danger'}>
            {statusList.find((i) => i.value === scope.row.status)?.label ?? scope.row.status}
          </el-tag>
        )
      }
    }
  },
  { prop: 'createTime', label: '上传时间', type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: '下载', onClick: download },
      { label: '编辑', auth: 'system:file:edit', onClick: (row) => openForm('edit', row) },
      {
        label: '明细',
        auth: 'system:file:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: '删除',
        auth: 'system:file:del',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delFileByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: '确认删除吗？此操作会删除实际文件，删除后不可恢复！'
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

// 文件下载
function download(file) {
  window.open(getDownloadFileUrl({ object: file.object, fileName: file.name }))
}

// 图片文件预览
function previewImage(scope) {
  const file = scope.row
  if (file.contentType.startsWith('image')) {
    const src = getDownloadFileUrl({ object: file.object, isScale: true })
    if (file.suffix === 'svg')
      return <m-svg-icon inherited={true} style="width: 25px; height: 25px; display: block" src={src} />
    return (
      <el-image
        {...{
          src,
          style: 'width: 25px; height: 25px;',
          fit: 'cover',
          previewSrcList: [getDownloadFileUrl({ object: file.object })],
          hideOnClickModal: true,
          previewTeleported: true
        }}
      />
    )
  }
}

function cellStyle({ row, column }) {
  if (column.property === 'status' && row.status === 1) {
    return {
      color: 'green'
    }
  }
}

function close(type) {
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
