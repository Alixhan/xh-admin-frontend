<template>
  <el-checkbox label="全选" :model-value="checkAll" :indeterminate="indeterminate" @change="handleCheckAllChange" />
  <div class="sort-view" :ref="sortViewRef">
    <el-checkbox
      v-for="column in columnsR"
      :key="column.prop ?? '' + column.label ?? ''"
      :label="column.label"
      :model-value="!column.hidden"
      @update:model-value="updateValue(column)"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Sortable from 'sortablejs'

/**
 * 通用表格列排序
 * sxh
 * 2023-3-24
 */

const emits = defineEmits(['change'])
const props = defineProps({
  columns: {
    type: Array,
    required: true
  }
})

const columnsR = ref(props.columns)
const sortViewRef = (el) => {
  // 拖拽排序
  Sortable.create(el, {
    animation: 150,
    onEnd({ oldIndex, newIndex }) {
      if (oldIndex !== newIndex) {
        const columns = props.columns
        // 先取出元素
        const column = columns.splice(oldIndex, 1)
        // 插入新位置
        columns.splice(newIndex, 0, ...column)
        emits('change')
      }
    }
  })
}

const checkAll = computed(() => columnsR.value.every((i) => !i.hidden))
const indeterminate = computed(() => !(columnsR.value.every((i) => i.hidden) || checkAll.value))

function updateValue(column) {
  column.hidden = !column.hidden
  emits('change')
}
function handleCheckAllChange() {
  const hidden = checkAll.value
  columnsR.value.forEach((i) => (i.hidden = hidden))
  emits('change')
}
</script>
<style scoped lang="scss">
.sort-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top: var(--el-border);
  padding-top: 5px;

  > .el-checkbox {
    height: 25px;
    margin-right: 0;
  }
}
</style>
