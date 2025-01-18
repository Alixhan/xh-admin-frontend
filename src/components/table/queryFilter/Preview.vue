<template>
  <span v-html="previewHtml" />
</template>
<script setup lang="ts">
import { inject } from 'vue'
import type { QueryFilter } from '@i/components/table'
import { usePreview } from '@/components/table/queryFilter/queryFilter'

const filters = inject<QueryFilter>('queryFilter')!.filters

const { previewHtml } = usePreview(filters)
</script>
<style scoped lang="scss">
:deep(.valid) {
  text-decoration: line-through;
  opacity: 0.5;

  .valid {
    opacity: 1;
  }
}

:deep(.logic) {
  color: var(--el-color-danger);
  font-weight: bold;
}

:deep(.field) {
  color: var(--el-color-primary);
}

:deep(.condition) {
  color: var(--el-color-success);
}

:deep(.value) {
  color: var(--el-text-color);
}
</style>
