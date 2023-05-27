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
      :fetch-data="queryDictTypeList"
      :selection="selection"
      :selection-limit="selectionLimit"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button
          :disabled="selectRows.length === 0 || selectRows.length > selectionLimit"
          type="primary"
          @click="emit('select', selectRows)"
          >选择
        </el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="jsx">
import { ref, shallowRef } from 'vue'
import { queryDictTypeList } from '@/api/system/dict'
import { statusList } from '@/views/system/file/constant'
import { getDownloadFileUrl } from '@/utils'
import { filesize } from 'filesize'

const props = defineProps({
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
    type: Number
  }
})
const emit = defineEmits(['close', 'select'])

const selectRows = ref([])

const topFilterColumns = shallowRef([{ prop: 'name', label: '字典类型名称' }])

// 表单字段根据表单数据变化，有所不同
const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'id' },
  { prop: 'name', label: '数据字典类型名称' },
  { prop: 'createTime', label: '创建时间', disabled: true }
])

// 图片文件预览
function previewImage (scope) {
  const file = scope.row
  if (file.contentType.startsWith('image')) {
    const src = getDownloadFileUrl({ object: file.object, isScale: true })
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

function close (type) {
  emit('close', type)
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
