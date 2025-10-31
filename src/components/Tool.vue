<template>
  <el-tooltip :content="label" :placement="placement">
    <div class="tool-view" :class="{ checked: modelValue }" @click="modelValue = !modelValue">
      <slot />
    </div>
  </el-tooltip>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

const modelValue = defineModel<boolean>({ required: true })

defineProps({
  // 标题
  label: {
    type: String,
    required: true
  },
  // 标题
  placement: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    required: true
  }
})
</script>
<style lang="scss" scoped>
.tool-view {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s;

  &:hover,
  &.checked {
    background-color: var(--layout-bg-color);
  }

  &.checked {
    color: var(--el-color-primary);
  }
}
</style>
