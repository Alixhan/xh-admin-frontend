<template>
  <div class="form-view">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
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
        <el-button
          :disabled="selectRows.length === 0 || selectRows.length > selectionLimit"
          type="primary"
          @click="emit('select', selectRows)"
          >{{ $t('common.select') }}
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
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
const emit = defineEmits(['close', 'select'])

const selectRows = ref([])

const topFilterColumns = shallowRef([
  { prop: 'object', label: t('system.file.object') },
  { prop: 'name', label: t('system.file.name') },
  { prop: 'contentType', label: t('system.file.contentType') },
  { prop: 'suffix', label: t('system.file.suffix') },
  { prop: 'sha1', label: t('system.file.sha1') }
])

// 表格列定义
const columns = ref([
  { prop: 'object', label: t('system.file.object') },
  { prop: 'name', label: t('system.file.name') },
  { prop: 'contentType', label: t('system.file.contentType') },
  { prop: 'suffix', label: t('system.file.suffix') },
  {
    prop: 'size',
    label: t('system.file.suffix'),
    formatter: (...args) => filesize(args[2], { base: 2, standard: 'jedec' })
  },
  { prop: 'preview', label: t('system.file.preview'), slots: { default: previewImage } },
  { prop: 'imgWidth', label: t('system.file.imgWidth') },
  { prop: 'imgHeight', label: t('system.file.imgHeight') },
  { prop: 'imgRatio', label: t('system.file.imgRatio') },
  { prop: 'status', label: t('system.file.status'), type: 'select', itemList: statusList },
  { prop: 'sha1', label: t('system.file.suffix'), comment: t('system.file.sha1Comment') },
  { prop: 'createTime', label: t('system.file.createTime'), width: 160 }
])

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
