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
      :fetch-data="queryRoleList"
      :selection="selection"
      :selection-limit="selectionLimit"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button
          :disabled="selectRows.length === 0 || (selectionLimit && selectRows.length > selectionLimit)"
          type="primary"
          @click="emit('select', selectRows)"
        >
          {{ $t('common.select') }}
        </el-button>
        <el-button @click="emit('clear')">{{ $t('common.clear') }}</el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, shallowRef } from 'vue'
import { queryRoleList } from '@/api/system/role'
import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'

defineProps({
  selection: {
    type: String as PropType<TableSelection>,
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
const emit = defineEmits(['select', 'clear'])

const { t } = useI18n()
const selectRows = ref([])

const topFilterColumns = shallowRef([
  { prop: 'parentId', label: t('system.role.parentId'), hidden: true },
  { prop: 'parentName', label: t('system.role.parentName'), readonly: true },
  { prop: 'name', label: t('system.role.name') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

// 表格列定义
const columns: TableColumn[] = [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'name', label: t('system.role.name') },
  { prop: 'parentName', label: t('system.role.parentName') },
  { prop: 'parentId', label: t('system.role.parentId') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 }
]
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
