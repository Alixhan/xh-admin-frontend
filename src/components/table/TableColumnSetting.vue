<template>
  <el-popover trigger="click" :hideAfter="0" popper-style="min-width: 100px; width: auto;">
    <template #reference>
      <el-button type="primary" text icon="operation" class="action-btn">{{ $t('m.table.colSetting') }}</el-button>
    </template>
    <div class="action-view" v-if="persistLayoutKey">
      <el-checkbox :label="$t('m.table.persist')" v-model="persist" />
      <m-tool :label="$t('m.table.border')" placement="top" v-model="border">
        <m-svg-icon class="icon" src="@/assets/icon/border.svg" inherited />
      </m-tool>
    </div>
    <el-tree
      class="column-sort"
      ref="treeRef"
      :data="treeData"
      :props="defaultProps"
      node-key="_id"
      show-checkbox
      default-expand-all
      draggable
      :default-checked-keys="defaultCheckedKeys"
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @check-change="checkChange"
    >
      <template #default="{ node, data }">
        <span>{{ node.label }}</span>
        <el-link
          v-if="data._id === 'root'"
          style="flex-grow: 1; padding-left: 10px"
          @click="emits('restoreDefault')"
          underline="never"
          type="primary"
        >
          {{ $t('common.restoreDefault') }}
        </el-link>
        <div v-else-if="!data._parentId" :class="`icon-view ${data.fixed}`">
          <m-svg-icon
            v-if="data.fixed === 'left'"
            class="icon left"
            src="@/assets/icon/pin-fill.svg"
            @click.stop="pin(data)"
          />
          <m-svg-icon v-else class="icon left" src="@/assets/icon/pin-line.svg" @click.stop="pin(data, 'left')" />
          <m-svg-icon
            v-if="data.fixed === 'right'"
            class="icon right"
            src="@/assets/icon/pin-fill.svg"
            @click.stop="pin(data)"
          />
          <m-svg-icon v-else class="icon right" src="@/assets/icon/pin-line.svg" @click.stop="pin(data, 'right')" />
        </div>
      </template>
    </el-tree>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { TableSortColumn } from '@i/components/table'
import MSvgIcon from '@/components/SvgIcon.vue'
import MTool from '@/components/Tool.vue'

/**
 * 通用表格列设置
 * sxh
 * 2023-3-24
 */

const { t } = useI18n()

const emits = defineEmits<{
  //恢复默认
  (e: 'restoreDefault'): void
}>()

const props = defineProps({
  // 表格持久化布局ID
  persistLayoutKey: String,
  columns: {
    type: Array as PropType<TableSortColumn[]>,
    required: true
  },
})

const defaultCheckedKeys = computed(() => props.columns.filter((i) => !i.hidden).map((i) => i._id))

const persist = defineModel<boolean>('persist', { default: false })

const border = defineModel<boolean>('border', { default: true })

const treeRef = ref()

const defaultProps = {
  children: 'children',
  label: 'label',
  class: (data: TableSortColumn) => {
    if (data._id === 'root') {
      return 'custom-tree-root'
    } else {
      return 'custom-tree-col'
    }
  }
}

const treeData = ref<any[]>([])

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
function allowDrop(draggingNode: any, dropNode: any, type: any) {
  return ['prev', 'next'].includes(type) && draggingNode.parent === dropNode.parent
}

function checkChange(node: Node & TableSortColumn, checked: boolean, halfChecked: boolean) {
  if (node._id !== 'root') {
    node.hidden = !(checked || halfChecked)
  } else {
    if (halfChecked) return
    props.columns?.forEach((i) => (i.hidden = !(checked || halfChecked)))
  }
}

//toggle pin
function pin(data: TableSortColumn, fixed?: 'left' | 'right') {
  data.fixed = fixed
}

defineExpose({
  setChecked(key: string, checked: boolean) {
    treeRef.value!.setChecked(key, checked)
  }
})
</script>
<style scoped lang="scss">
:deep(.custom-tree-root) {
  > .el-tree-node__content {
    display: flex;
    align-items: center;
    border-bottom: var(--el-border);
    cursor: default;
    background-color: inherit !important;
    position: relative;
  }

  > .el-tree-node__children {
    z-index: -1000;
  }
}
:deep(.custom-tree-col) {
  > .el-tree-node__content {
    position: relative;

    .icon-view {
      cursor: default;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      display: none;
      align-items: center;
      box-sizing: content-box;
      border-radius: 4px;
      background-color: inherit;
      padding-left: 5px;
      gap: 3px;

      &.left {
        display: flex;
        > .left {
          color: var(--el-color-primary);
        }
      }

      &.right {
        display: flex;
        > .right {
          color: var(--el-color-primary);
        }
      }
    }

    &:hover {
      .icon-view {
        display: flex;
      }
    }
  }
}

.icon {
  cursor: pointer;
  display: block;
  width: 1.2em;
  &.left {
    transform: rotate(-90deg);
  }
}

.action-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}
</style>
