import type { PropType } from 'vue'

export const singleDatePickerProps = {
  // 开始时间
  start: {
    type: [String, Date]
  },
  // 截止时间
  end: {
    type: [String, Date]
  },
  // 绑定值格式化
  valueFormat: {
    type: String
  },
  // 选择范围类型
  type: {
    type: String as PropType<'datetimerange' | 'daterange' | 'monthrange'>,
    required: true
  },
  // 开始时间的占位内容
  startPlaceholder: {
    type: String
  },
  // 截止时间的占位内容
  endPlaceholder: {
    type: String
  },
  // 分隔符
  rangeSeparator: {
    type: String
  }
}
