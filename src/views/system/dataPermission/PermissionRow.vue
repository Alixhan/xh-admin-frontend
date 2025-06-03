<template>
  <div class="permission-row">
    <el-icon @click="emits('remove')" size="16" color="var(--el-color-danger)" style="cursor: pointer">
      <Remove />
    </el-icon>
    <el-link style="width: 16px" type="danger" underline="never" @click="switchLogic">
      <template v-if="props.index !== 0">{{ $t('m.table.' + modelValue.logic) }}</template>
    </el-link>
    <template v-if="!modelValue.children?.length">
      <el-select class="filter-input" v-model="modelValue.condition" size="small">
        <el-option
          v-for="(comparator, i) in comparators"
          :key="i"
          :label="$t('system.dataPermission.' + comparator)"
          :value="comparator"
        />
      </el-select>
      <el-select class="filter-input" v-model="modelValue.prop" size="small" @change="changeProp">
        <el-option v-for="(column, i) in permissionHome.columns" :key="i" :label="column.label" :value="column.prop" />
      </el-select>
      <el-input
        v-if="['$ZDJG', '$ZDJS', '$ZDYH'].includes(modelValue.prop)"
        class="filter-input"
        v-model="modelValue.value"
        size="small"
        clearable
      />
    </template>
    <el-icon @click="addChildRow" size="16" color="var(--el-color-primary)" style="cursor: pointer">
      <CirclePlus />
    </el-icon>
  </div>
  <div class="child-rows">
    <PermissionRow
      v-for="(filter, index) in modelValue?.children ?? []"
      :key="index"
      :index="index"
      :model-value="filter"
      @remove="handleRemove(index)"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { type PermissionRowType } from './dataPermissionForm.vue'
import type { PermissionHome } from '@/views/system/dataPermission/dataPermissionForm.vue'

defineOptions({
  name: 'PermissionRow',
  inheritAttrs: false
})

const props = defineProps({
  index: Number
})

const emits = defineEmits<{
  (e: 'remove'): void
}>()

const modelValue = defineModel<PermissionRowType>({ default: {} })

const permissionHome = inject<PermissionHome>('permissionHome')!

const column = computed(() => {
  return permissionHome.columns?.find((i) => i.prop === modelValue.value.prop)
})

const comparators = computed(() => {
  return ['positive', 'negative']
})

watch(
  () => column.value?.prop,
  () => {
    delete modelValue.value.value
  }
)

//初始化一下关联条件
changeProp()

function changeProp() {
  if (!comparators.value.includes(modelValue.value.condition ?? '')) {
    modelValue.value.condition = comparators.value[0] as any
  }
}

//添加子行
function addChildRow() {
  permissionHome!.addRow(modelValue.value)
}

function handleRemove(index: number) {
  permissionHome!.removeRow(index, modelValue.value)
}

function switchLogic() {
  modelValue.value.logic = modelValue.value.logic === 'and' ? 'or' : 'and'
}
</script>
<style scoped lang="scss">
.permission-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 0;

  .filter-input {
    width: 12em;
  }
}

.child-rows {
  margin-left: 24px;
}
</style>
