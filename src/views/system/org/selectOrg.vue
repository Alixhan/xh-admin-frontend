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
      :fetch-data="queryOrgList"
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
import { queryOrgList } from '@/api/system/org'
import getDictDetails from '@/utils/dict'

defineProps({
  selection: {
    type: String,
    default: 'multiple',
  },
  param: {
    type: Object,
    default: () => ({}),
  },
  /**
   * 最多可选择行数
   */
  selectionLimit: {
    type: Number,
  },
})
const emit = defineEmits(['select'])

const selectRows = ref([])

const topFilterColumns = shallowRef([
  { prop: 'parentId', label: '上级机构id', hidden: true },
  { prop: 'parentName', label: '上级机构名称', readonly: true },
  { prop: 'code', label: '机构代码' },
  { prop: 'name', label: '机构名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
])

// 表格列定义
const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'parentName', label: '上级机构' },
  { prop: 'parentId', label: '上级机构ID', width: 100 },
  { prop: 'code', label: '机构代码' },
  { prop: 'name', label: '机构名称' },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
])
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
