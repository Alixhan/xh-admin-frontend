<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
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
          >{{ $t('common.del') }}
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('system.file.' + handleType)"
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
import { computed, createVNode, reactive, ref } from 'vue'
import { delFileByIds, queryFileList } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
import FileForm from './fileForm.vue'
import { filesize } from 'filesize'
import { getDownloadFileUrl } from '@/utils'
import { useI18n } from 'vue-i18n'
import MSvgIcon from '@/components/SvgIcon.vue'

const { t } = useI18n()

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'object', label: t('system.file.object') },
  { prop: 'name', label: t('system.file.name') },
  { prop: 'contentType', label: t('system.file.contentType') },
  { prop: 'suffix', label: t('system.file.suffix') },
  { prop: 'sha1', label: t('system.file.sha1') }
])

const columns = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'name', label: t('system.file.name') },
  { prop: 'object', label: t('system.file.object') },
  { prop: 'contentType', label: t('system.file.contentType') },
  { prop: 'suffix', label: t('system.file.suffix') },
  {
    prop: 'size',
    label: t('system.file.size'),
    formatter: (...args) => filesize(args[2], { base: 2, standard: 'jedec' })
  },
  { prop: 'url', label: t('system.file.preview'), slots: { default: previewImage } },
  { prop: 'imgWidth', label: t('system.file.imgWidth') },
  { prop: 'imgHeight', label: t('system.file.imgHeight') },
  { prop: 'imgRatio', label: t('system.file.imgRatio') },
  {
    prop: 'status',
    label: t('system.file.status'),
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
  { prop: 'createTime', label: t('system.file.createTime'), type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('system.file.download'), icon: 'download', onClick: download },
      { label: t('common.edit'), icon: 'edit', auth: 'system:file:edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:file:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        icon: 'delete',
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
    confirmMsg: t('common.confirmDelete')
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

// 文件下载
function download(file) {
  globalThis.open(getDownloadFileUrl({ object: file.object, fileName: file.name }))
}

// 图片文件预览
function previewImage(scope) {
  const file = scope.row
  if (file.contentType.startsWith('image')) {
    const src = getDownloadFileUrl({ object: file.object, isScale: true })
    if (file.suffix === 'svg')
      return createVNode(MSvgIcon, {
        inherited: true,
        style: 'width: 25px; height: 25px; display: block',
        src
      })
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
