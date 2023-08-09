<template>
  <div class="m-single-date-picker" :style="{ lineHeight: inputHeight }">
    <el-date-picker v-bind="startParam" :model-value="$props.start" />
    <el-text style="font-weight: bold">{{ $props.rangeSeparator ?? '-' }}</el-text>
    <el-date-picker v-bind="endParam" :model-value="$props.end" />
  </div>
</template>
<script>
import { defineComponent, toRef } from 'vue'
import dayjs from 'dayjs'

/**
 * 独立分开的日期区间picker
 * sxh 2023-3-15
 */
export default defineComponent({
  inheritAttrs: false,
  name: 'MSingleDatePicker',
  props: ['start', 'end', 'valueFormat', 'type', 'startPlaceholder', 'endPlaceholder', 'rangeSeparator'],
  emits: ['update:start', 'update:end'],
  setup(props, { attrs, emit }) {
    const type = toRef(props, 'type').value.replace('range', '')

    const shortcuts = [
      {
        text: '最近一周',
        value() {
          const start = dayjs().subtract(1, 'week').toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '最近一个月',
        value() {
          const start = dayjs().subtract(1, 'month').toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '最近三个月',
        value() {
          const start = dayjs().subtract(3, 'month').toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '最近六个月',
        value() {
          const start = dayjs().subtract(6, 'month').toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '当月',
        value() {
          const start = dayjs().date(1).toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '当年',
        value() {
          const start = dayjs().month(0).date(1).toDate()
          updateEnd(getFormatDate(new Date()))
          return start
        }
      },
      {
        text: '上个月',
        value() {
          const start = dayjs().subtract(1, 'month').date(1).toDate()
          const end = dayjs().date(1).subtract(1, 'day').toDate()
          updateEnd(getFormatDate(end))
          return start
        }
      },
      {
        text: '去年',
        value() {
          const start = dayjs().subtract(1, 'year').month(0).date(1).toDate()
          const end = dayjs().month(0).date(1).subtract(1, 'day').toDate()
          updateEnd(getFormatDate(end))
          return start
        }
      }
    ]

    function getFormatDate(date) {
      if (props.valueFormat) date = dayjs(date).format(props.valueFormat)
      return date
    }

    function updateStart(val) {
      emit('update:start', val)
    }

    function updateEnd(val) {
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
      disabledDate(date) {
        if (props.end) return date.getTime() > new Date(props.end).getTime()
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
      disabledDate(date) {
        if (props.start) return date.getTime() < new Date(props.start).getTime()
      }
    }

    return {
      inputHeight,
      startParam,
      endParam
    }
  }
})
</script>
<style scoped lang="scss">
.m-single-date-picker {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: stretch;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  transition: var(--el-transition-box-shadow);

  &:hover {
    box-shadow: 0 0 0 1px var(--el-text-color-disabled, var(--el-border-color)) inset;
  }

  .is-focus {
    box-shadow: 0 0 0 1px var(--el-color-primary, var(--el-border-color)) inset;
  }

  .date-picker {
    text-align: center;
  }

  :deep(.el-input) {
    padding: 1px;
  }

  :deep(.el-input__wrapper) {
    border: none;
    box-shadow: none;
  }
}
</style>
