<template>
  <el-popover trigger="click" :hideAfter="0" popper-style="min-width: 100px; width: auto;">
    <template #reference>
      <el-button type="primary" text icon="operation" class="action-btn"> 列排序</el-button>
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
      @node-drop="nodeDrop"
    />
  </el-popover>
</template>

<script setup>
import { ref, toRef } from 'vue'

/**
 * 通用表格列排序
 * sxh
 * 2023-3-24
 */

const emits = defineEmits(['change'])
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
})

const treeRef = ref()

const columns = toRef(props, 'columns')

const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeData = ref([
  {
    _id: 'root',
    label: '全部列',
    children: columns.value,
  },
])

//只允许同级拖拽
function allowDrop(draggingNode, dropNode, type) {
  return ['prev', 'next'].includes(type) && draggingNode.parent === dropNode.parent
}

function checkChange(node, checked, halfChecked) {
  if (node._id !== 'root') {
    node.hidden = !(checked || halfChecked)
    emits('change')
  }
}

function nodeDrop() {
  emits('change')
}
</script>
<style scoped lang="scss">
.column-sort {
  :deep(.el-tree-node__expand-icon) {
    display: none;
  }
}
</style>
