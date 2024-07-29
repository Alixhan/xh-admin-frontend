<template>
  <div class="m-single-date-picker" :style="{ lineHeight: inputHeight }">
    <el-date-picker v-bind="startParam" :model-value="props.start" />
    <el-text>{{ props.rangeSeparator ?? '-' }}</el-text>
    <el-date-picker v-bind="endParam" :model-value="props.end" />
  </div>
</template>
<script lang="ts" setup>
/**
 * 通用表格组件
 * @author sxh 2023-3-12
 */
import { toRef, useAttrs } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { singleDatePickerProps } from '@i/components/singleDatePicker'

const { t } = useI18n()

defineOptions({
  name: 'MSingleDatePicker'
})

const attrs = useAttrs()
const emit = defineEmits(['update:start', 'update:end'])
const props = defineProps({ ...singleDatePickerProps })
const type = toRef(props, 'type').value!.replace('range', '')

const shortcuts = [
  {
    text: t('m.form.shortcuts1'),
    value() {
      const start = dayjs().subtract(1, 'week').toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts2'),
    value() {
      const start = dayjs().subtract(1, 'month').toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts3'),
    value() {
      const start = dayjs().subtract(3, 'month').toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts4'),
    value() {
      const start = dayjs().subtract(6, 'month').toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts5'),
    value() {
      const start = dayjs().date(1).toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts6'),
    value() {
      const start = dayjs().month(0).date(1).toDate()
      updateEnd(getFormatDate(new Date()))
      return start
    }
  },
  {
    text: t('m.form.shortcuts7'),
    value() {
      const start = dayjs().subtract(1, 'month').date(1).toDate()
      const end = dayjs().date(1).subtract(1, 'day').toDate()
      updateEnd(getFormatDate(end))
      return start
    }
  },
  {
    text: t('m.form.shortcuts8'),
    value() {
      const start = dayjs().subtract(1, 'year').month(0).date(1).toDate()
      const end = dayjs().month(0).date(1).subtract(1, 'day').toDate()
      updateEnd(getFormatDate(end))
      return start
    }
  }
]

function getFormatDate(date: Date) {
  if (props.valueFormat) return dayjs(date).format(props.valueFormat)
  return date.toString()
}

function updateStart(val: string) {
  emit('update:start', val)
}

function updateEnd(val: string) {
  emit('update:end', val)
}

const inputHeight = `var(--el-component-size${attrs.size ? '-' + attrs.size : ''})`

const startParam = {
  ...attrs,
  ...props,
  key: '1',
  placeholder: toRef(props, 'startPlaceholder').value,
  className: 'date-picker',
  type,
  'onUpdate:modelValue': updateStart,
  shortcuts,
  disabledDate(date: Date) {
    if (props.end) return dayjs(date).isAfter(dayjs(props.end))
  }
}
const endParam = {
  ...attrs,
  ...props,
  key: '2',
  placeholder: toRef(props, 'endPlaceholder').value,
  className: 'date-picker',
  type,
  'onUpdate:modelValue': updateEnd,
  disabledDate(date: Date) {
    if (props.start) return dayjs(date).isBefore(dayjs(props.start))
  }
}

/**
 * 独立分开的日期区间picker
 * sxh 2023-3-15
 */
</script>
<style scoped lang="scss">
.m-single-date-picker {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;

  ::v-deep(> div) {
    flex: 1;
  }
}
</style>
