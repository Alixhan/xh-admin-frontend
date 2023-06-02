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
      :fetch-data="queryDictDetailList"
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
import { queryDictDetailList } from '@/api/system/dict'
import { sfList } from '@/views/system/menu/constant'

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
    type: Number
  }
})
const emit = defineEmits(['select'])

const selectRows = ref([])

const topFilterColumns = shallowRef([
  { prop: 'dictTypeId', label: '字典类型ID', hidden: true },
  { prop: 'dictTypeName', label: '字典类型', readonly: true },
  { prop: 'value', label: '字典值key' },
  { prop: 'label', label: '字典名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: sfList }
])

// 表单字段根据表单数据变化，有所不同
const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'dictTypeName', label: '字典类型' },
  { prop: 'parentId', label: '上级id' },
  { prop: 'value', label: '字典key' },
  { prop: 'label', label: '字典名称' },
  {
    prop: 'order',
    label: '排序号',
    width: 85,
    comment: '数据字典的排列顺序，小号排在前，大号排在后。'
  },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: sfList },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  { prop: 'updateTime', label: '修改时间', type: 'datetime', width: 155 }
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
