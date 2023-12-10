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
      :fetch-data="queryUserList"
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
import getDictDetails from '@/utils/dict'
import { queryUserList } from '@/api/system/user'
import { statusList } from '@/views/system/user/constant'

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
  { prop: 'code', label: '用户账号' },
  { prop: 'name', label: '用户名' }
])

// 表格列定义
const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'code', label: '用户账号' },
  { prop: 'name', label: '用户名称' },
  { prop: 'status', label: '用户状态', type: 'select', itemList: statusList },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 }
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
