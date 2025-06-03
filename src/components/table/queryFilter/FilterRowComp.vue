<template>
  <div class="query-filter-row">
    <el-icon @click="emits('remove')" size="16" color="var(--el-color-danger)" style="cursor: pointer">
      <Remove />
    </el-icon>
    <el-checkbox v-model="modelValue.checked" @change="changeChecked" size="small" />
    <el-link style="width: 16px" type="danger" underline="never" @click="switchLogic">
      <template v-if="props.index !== 0">{{ $t('m.table.' + modelValue.logic) }}</template>
    </el-link>
    <template v-if="!modelValue.children?.length">
      <el-select class="filter-input" v-model="modelValue.prop" size="small" @change="changeProp" clearable>
        <el-option v-for="(column, i) in leafColumns" :key="i" :label="column.label" :value="column.prop" />
      </el-select>
      <el-select class="filter-input" v-model="modelValue.condition" size="small">
        <el-option
          v-for="(comparator, i) in comparators"
          :key="i"
          :label="$t('m.table.' + comparator)"
          :value="comparator"
        />
      </el-select>
      <el-select v-if="column?.itemList" class="filter-input" v-model="modelValue.value1" size="small" clearable>
        <el-option
          v-for="(item, i) in column.itemList as CommonItemData[]"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-else-if="['date', 'datetime'].includes(column?.type ?? '')"
        size="small"
        style="width: 13em"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        v-model="modelValue.value1"
      />
      <el-input v-else class="filter-input" :type="column?.type" v-model="modelValue.value1" size="small" clearable />
      <template v-if="modelValue.condition === 'bt'">
        <el-date-picker
          key="2"
          v-if="['date', 'datetime'].includes(column?.type ?? '')"
          size="small"
          style="width: 13em"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="new Date('2000-10-01 23:59:59')"
          v-model="modelValue.value2"
        />
        <el-input v-else class="filter-input" :type="column?.type" v-model="modelValue.value2" size="small" clearable />
      </template>
    </template>
    <el-icon
      v-if="queryFilter!.recursive"
      @click="addChildRow"
      size="16"
      color="var(--el-color-primary)"
      style="cursor: pointer"
    >
      <CirclePlus />
    </el-icon>
  </div>
  <div class="child-rows">
    <filter-row-comp
      v-for="(filter, index) in modelValue?.children ?? []"
      :key="index"
      :index="index"
      :model-value="filter"
      @remove="handleRemove(index)"
      @change-check="initChecked"
    />
  </div>
</template>
<script setup lang="ts">
import type { CommonTableColumn, FilterRow, QueryFilter } from '@i/components/table'
import { computed, inject, onMounted, watch } from 'vue'
import type { CommonItemData } from '@i/components'

defineOptions({
  name: 'FilterRowComp'
})

const props = defineProps({
  index: Number
})

const emits = defineEmits<{
  (e: 'remove'): void
  (e: 'changeCheck'): void
}>()

const modelValue = defineModel<FilterRow>({ default: {} })

const queryFilter = inject<QueryFilter>('queryFilter')

const leafColumns = inject<CommonTableColumn<any>[]>('leafColumns')

const column = computed(() => {
  return leafColumns?.find((i) => i.prop === modelValue.value.prop)
})

const comparators = computed(() => {
  if (column.value) {
    if (column.value.itemList) return ['eq', 'ne']
    if (column.value.type === 'number' || column.value.type?.startsWith('date')) {
      return ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'bt']
    }
  }
  return ['ct', 'nct', 'eq', 'ne', 'gt', 'ge', 'lt', 'le', 'in', 'bt']
})

watch(
  () => column.value?.type,
  () => {
    delete modelValue.value.value1
    delete modelValue.value.value2
  }
)

//初始化一下关联条件
changeProp()

//添加一行时需要更新父级checkbox的选中状态
onMounted(() => emits('changeCheck'))

function changeProp() {
  if (!comparators.value.includes(modelValue.value.condition ?? '')) {
    modelValue.value.condition = comparators.value[0] as any
  }
}

function changeChecked() {
  queryFilter?.changeCheck(modelValue.value, modelValue.value.checked)
  emits('changeCheck')
}

function initChecked() {
  if (modelValue.value.children?.length ?? 0) {
    modelValue.value.checked = !!modelValue.value.children?.some((i) => i.checked)
    emits('changeCheck')
  }
}

//添加子行
function addChildRow() {
  queryFilter!.addRow('', modelValue.value)
}

function handleRemove(index: number) {
  queryFilter!.removeRow(index, modelValue.value)
  initChecked()
}

function switchLogic() {
  modelValue.value.logic = modelValue.value.logic === 'and' ? 'or' : 'and'
}
</script>
<style scoped lang="scss">
.query-filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 0;

  .filter-input {
    width: 10em;
  }

  & {
    --el-date-editor-width: 11em;
  }
}

.child-rows {
  margin-left: 24px;
}
</style>
