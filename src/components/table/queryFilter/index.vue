<template>
  <el-popover placement="bottom" trigger="click" :visible="popoverVisible" popper-style="width: auto;" append-to-body>
    <div class="query-filter-view" @keyup.enter="search">
      <div class="title-view">
        <el-text size="large">{{ $t('m.table.complexFilter') }}</el-text>
        <el-icon @click="popoverVisible = false" size="16" class="close-icon">
          <Close />
        </el-icon>
      </div>
      <Preview />
      <div class="opt-btn">
        <div class="left-btn">
          <el-checkbox v-if="modelValue.length" v-model="checked" @change="changeChecked" size="small" />
          <el-icon @click="addRow('')" size="16" color="var(--el-color-primary)" style="cursor: pointer">
            <CirclePlus />
          </el-icon>
        </div>
        <div>
          <el-button @click="clear" type="danger" size="small">{{ $t('common.clear') }}</el-button>
          <el-button @click="search" type="primary" size="small">{{ $t('m.topFilter.search') }}</el-button>
        </div>
      </div>
      <filter-row-comp
        v-for="(filter, index) in modelValue"
        :key="index"
        :index="index"
        :model-value="filter"
        @change-check="initChecked"
        @remove="removeRow(index)"
      />
    </div>
    <template #reference>
      <el-button icon="Filter" :type="modelValue?.length ? 'danger' : 'primary'" text class="action-btn" @click="open">
        {{ $t('m.table.complexFilter') }}
      </el-button>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { onDeactivated, provide, ref } from 'vue'
import type { FilterRow, QueryFilter, QueryFilterProps } from '@i/components/table'
import FilterRowComp from './FilterRowComp.vue'
import Preview from '@/components/table/queryFilter/Preview.vue'

defineOptions({
  name: 'QueryFilter'
})

const props = withDefaults(defineProps<QueryFilterProps>(), {
  recursive: true
})

const emits = defineEmits<{
  (e: 'search'): void
}>()

const modelValue = defineModel<FilterRow[]>({ default: [] })

const checked = ref(false)

const popoverVisible = ref(false)

onDeactivated(() => (popoverVisible.value = false))

function addRow(prop: string, parent?: FilterRow) {
  const filterRow: FilterRow = {
    prop,
    logic: 'and',
    checked: true,
    value1: '',
    value2: '',
    children: undefined
  }
  if (parent) {
    parent.children ??= []
    if (parent.children.length === 0) {
      parent.children.push({ ...parent, children: undefined })
    }
    parent.children.push(filterRow)
  } else {
    modelValue.value.push(filterRow)
  }
  open()
}

function removeRow(index: number, parent?: FilterRow) {
  if (parent) {
    parent.children!.splice(index, 1)
    if (parent.children!.length === 1) {
      Object.assign(parent, parent.children![0])
    }
  } else {
    modelValue.value.splice(index, 1)
  }
  initChecked()
}

function open() {
  popoverVisible.value = true
}

function search() {
  popoverVisible.value = false
  emits('search')
}

function clear() {
  modelValue.value.length = 0
}

function changeChecked() {
  modelValue.value.forEach((i) => changeCheck(i, checked.value))
}

function initChecked() {
  checked.value = !!modelValue.value?.some((i) => i.checked)
}

function changeCheck(row: FilterRow, checked: boolean) {
  row.checked = checked
  row.children?.forEach((i) => changeCheck(i, checked))
}

provide<QueryFilter>('queryFilter', {
  recursive: props.recursive,
  filters: modelValue.value,
  changeCheck,
  addRow,
  removeRow
})

defineExpose({
  open,
  addRow
})
</script>
<style scoped lang="scss">
.query-filter-view {
  width: 800px;
  max-width: 85vw;

  .title-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .close-icon {
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .opt-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;

    .left-btn {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}

.reference-view {
  background-color: var(--el-backtop-bg-color);
  display: flex;
  align-items: center;
  border: 1px solid #e3e3e3;
  padding: 2px 5px;
}
</style>
