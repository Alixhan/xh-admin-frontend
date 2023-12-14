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
          >{{ $t('common.select') }}
        </el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="jsx">
import { computed, ref } from 'vue'
import { queryDictTypeList } from '@/api/system/dict'
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
    type: Number
  }
})

const { t } = useI18n()

const emit = defineEmits(['select'])

const selectRows = ref([])

const topFilterColumns = computed(() => [{ prop: 'name', label: t('system.dict.dictTypeName') }])

// 表格列定义
const columns = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id' },
  { prop: 'name', label: t('system.dict.dictTypeName') },
  { prop: 'createTime', label: t('common.createTime'), disabled: true }
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
