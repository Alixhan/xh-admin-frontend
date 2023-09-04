<template>
  <div class="form-view">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      row-key="id"
      :filter-param="param"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryFileList"
      :selection="selection"
      :selection-limit="selectionLimit"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button :disabled="selectRows.length === 0 || selectRows.length > selectionLimit" type="primary" @click="emit('select', selectRows)"
          >选择
        </el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="jsx">
import { ref, shallowRef } from 'vue'
import { queryFileList } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
import { getDownloadFileUrl } from '@/utils'
import { filesize } from 'filesize'

defineProps({
  selection: {
    type: String,
    default: 'multiple'
  },
  param: {
    type: Object,
    default: () => ({})
  },
  /**
   * 最多可选择行数
   */
  selectionLimit: {
    type: [Number, undefined]
  }
})
const emit = defineEmits(['close', 'select'])

const selectRows = ref([])

const topFilterColumns = shallowRef([
  { prop: 'object', label: '对象存储key' },
  { prop: 'name', label: '文件名称' },
  { prop: 'contentType', label: '文件类型' },
  { prop: 'suffix', label: '文件扩展名' },
  { prop: 'sha1', label: 'sha1' }
])

// 表格列定义
const columns = ref([
  { prop: 'object', label: '对象存储key', width: 120 },
  { prop: 'name', label: '文件名' },
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
  { prop: 'preview', label: '图片预览', slots: { default: previewImage } },
  { prop: 'imgWidth', label: '图片宽度' },
  { prop: 'imgHeight', label: '图片高度' },
  { prop: 'imgRatio', label: '图片宽高比', width: 100 },
  { prop: 'status', label: '文件状态', type: 'select', itemList: statusList },
  {
    prop: 'sha1',
    label: '文件摘要sha1',
    width: 130,
    comment: '同一个文件的sha1相同，相同sha1不会重复上传文件'
  },
  { prop: 'createTime', label: '上传时间', width: 160 }
])

// 图片文件预览
function previewImage(scope) {
  const file = scope.row
  if (file.contentType.startsWith('image')) {
    const src = getDownloadFileUrl({ object: file.object, isScale: true })
    if(file.suffix === 'svg') return <m-svg-icon inherited={true} style="width: 25px; height: 25px; display: block" src={src} />
    return (
      <el-image
        {...{
          src,
          style: 'width: 30px; height: 30px;',
          fit: 'cover',
          previewSrcList: [getDownloadFileUrl({ object: file.object })],
          hideOnClickModal: true,
          previewTeleported: true
        }}
      />
    )
  }
}
</script>
<style lang="scss" scoped>
.form-view {
  padding: 10px;
  background-color: var(--layout-bg-color);
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-table {
    height: 0;
    flex-grow: 1;
  }

  :deep(.el-image) {
    display: block;
  }
}
</style>
