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
      :fetch-data="queryOrgList"
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
import { queryOrgList } from '@/api/system/org'
import getDictDetails from '@/utils/dict'
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
const emit = defineEmits(['select'])

const { t } = useI18n()

const selectRows = ref([])

const topFilterColumns = computed(() => [
  { prop: 'parentId', label: t('system.org.code'), hidden: true },
  { prop: 'parentName', label: t('system.org.name'), readonly: true },
  { prop: 'code', label: t('system.org.parentId') },
  { prop: 'name', label: t('system.org.parentName') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

// 表格列定义
const columns = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'code', label: t('system.org.code') },
  { prop: 'name', label: t('system.org.name') },
  { prop: 'parentId', label: t('system.org.parentId') },
  { prop: 'parentName', label: t('system.org.parentName') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 }
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
