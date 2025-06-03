<template>
  <el-popover trigger="click" :hideAfter="0" popper-style="min-width: 100px; width: auto;">
    <template #reference>
      <el-button type="primary" text icon="operation" class="action-btn">{{ $t('m.table.colSort') }}</el-button>
    </template>
    <el-tree
      class="column-sort"
      ref="treeRef"
      :data="treeData"
      :props="defaultProps"
      node-key="_id"
      show-checkbox
      default-expand-all
      draggable
      :default-checked-keys="['root']"
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @check-change="checkChange"
    >
      <template #default="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data._id === 'root'" style="flex-grow: 1; text-align: right; padding-left: 10px">
          <el-link @click="emits('restoreDefault')" underline="never" type="primary">
            {{ $t('common.restoreDefault') }}
          </el-link>
        </span>
      </template>
    </el-tree>
  </el-popover>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { TableSortColumn } from '@i/components/table'

/**
 * 通用表格列排序
 * sxh
 * 2023-3-24
 */

const { t } = useI18n()

const emits = defineEmits<{
  //恢复默认
  (e: 'restoreDefault'): void
}>()

const props = defineProps({
  columns: {
    type: Array as PropType<TableSortColumn[]>,
    required: true
  }
})

const treeRef = ref()

const defaultProps = {
  children: 'children',
  label: 'label',
  class: (data: TableSortColumn) => {
    if (data._id === 'root') {
      return 'custom-tree-node'
    }
  }
}

const treeData = ref<TableSortColumn[]>([])

watchEffect(() => {
  treeData.value = [
    {
      _id: 'root',
      label: t('m.table.allCol'),
      children: props.columns
    }
  ]
})

//只允许同级拖拽
function allowDrop(draggingNode, dropNode, type) {
  return ['prev', 'next'].includes(type) && draggingNode.parent === dropNode.parent
}

function checkChange(node: Node & TableSortColumn, checked: boolean, halfChecked: boolean) {
  if (node._id !== 'root') {
    node.hidden = !(checked || halfChecked)
  }
}
</script>
<style scoped lang="scss">
:deep(.custom-tree-node) {
  > .el-tree-node__content {
    display: flex;
    align-items: center;
    border-bottom: var(--el-border);
    cursor: default;

    background-color: inherit !important;
  }

  > .el-tree-node__children {
    z-index: -1000;
  }
}
</style>
