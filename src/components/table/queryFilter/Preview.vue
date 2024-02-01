<template>
  <span v-html="previewHtml" />
</template>
<script setup lang="ts">
import { computed, inject, watchEffect } from 'vue'
import type { CommonTableColumn, FilterRow, PreviewType, QueryFilter } from '@i/components/table'
import { useI18n } from 'vue-i18n'
import { isUndefined } from 'lodash-es'

const { t } = useI18n()

const filters = inject<QueryFilter>('queryFilter')!.filters

const enabledFilters = inject<QueryFilter>('queryFilter')!.enabledFilters

const leafColumns = inject<CommonTableColumn<any>[]>('leafColumns')

const previews = computed(() => filters.map(getPreview))

const previewHtml = computed(() => previews.value.map((i) => i.str).join(''))

watchEffect(() => {
  enabledFilters.length = 0
  enabledFilters.push(...getEnabledFilters(previews.value))
})

function getEnabledFilters(previews?: PreviewType[]): FilterRow[] {
  return (
    previews
      ?.filter((preview) => preview.enabled)
      .map((preview) => {
        return {
          type: preview.type,
          logic: preview.logic,
          checked: preview.checked,
          prop: preview.prop,
          condition: preview.condition,
          value1: preview.value1,
          value2: preview.value2,
          children: getEnabledFilters(preview.children)
        }
      }) ?? []
  )
}

function getPreview(filter: FilterRow, index: number): PreviewType {
  const p: PreviewType = {
    ...filter,
    str: '',
    enabled: false,
    children: undefined
  }
  const column = leafColumns?.find((i) => i.prop === filter.prop)
  if (column) {
    p.type = column.type
    p.alias = column.alias
  }
  let str = ''
  if (index !== 0) str += `<span class="logic"> ${t('m.table.' + filter.logic)} </span> `
  if (filter.children?.length) {
    const childrenPreviews = filter.children.map((i, j) => getPreview(i, j))
    p.enabled = childrenPreviews.some((i) => i.enabled)
    str += ` ( ${childrenPreviews.map((i) => i.str).join('')} ) `
    p.children = childrenPreviews
  } else {
    p.enabled = !!column && filter.checked
    str += `<span class="field"> ${column?.label ?? '[请选择字段]'} </span>`
    str += `<span class="condition"> ${t('m.table.' + filter.condition)} </span>`
    str += getValueStr(filter.value1, column)
    if (filter.condition === 'bt') {
      str += getValueStr(filter.value2, column, ' - ')
    }
  }
  if (!p.enabled) {
    str = `<span class="valid" title="无效的查询条件！"> ${str} </span>`
  }
  p.str = str
  return p
}

function getValueStr(value: any, column?: CommonTableColumn<any>, prefix?: string) {
  let str = prefix ?? ''
  if (!isUndefined(value) && column?.itemList) {
    value = (column.itemList as any[]).find((i) => i.value === value)?.label
  }
  if (isUndefined(value)) str += 'null'
  else if (column?.type === 'number' || value instanceof Boolean) str += value
  else str += `'${value}'`
  return str
}
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
