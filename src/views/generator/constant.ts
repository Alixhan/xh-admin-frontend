export interface DesignTableColumn {
  prop: string
  columnName?: string
  formType: string
  label: string
  colType?: string
  javaType: string
  rules?: any
  isVirtual?: string
  dictType?: number
  primaryKey?: boolean
  primaryKeyType?: string
  remarks?: string
  columnSize?: number
  decimalDigits?: number
  isTable?: boolean
  isQuery?: boolean
  isForm?: boolean
  isImport?: boolean
  isExport?: boolean
}

export const preselectionColumns: DesignTableColumn[] = [
  {
    prop: 'text',
    formType: 'text',
    label: '文本',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isQuery: true,
    isForm: true,
    isImport: true,
    isExport: true
  },
  {
    prop: 'textarea',
    formType: 'textarea',
    label: '文本域',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 500
  },
  {
    prop: 'password',
    formType: 'password',
    label: '密码框',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isQuery: false,
    isExport: false
  },
  {
    prop: 'date',
    formType: 'date',
    label: '日期',
    colType: 'DATE',
    javaType: 'LocalDate'
  },
  {
    prop: 'datetime',
    formType: 'datetime',
    label: '日期时间',
    colType: 'DATETIME',
    javaType: 'LocalDateTime'
  },
  {
    prop: 'number',
    formType: 'number',
    label: '数值文本框',
    colType: 'DECIMAL',
    javaType: 'BigDecimal',
    rules: ['number']
  },
  { prop: 'inta', formType: 'int', label: '整数', colType: 'INT', javaType: 'Integer', rules: ['int'] },
  {
    prop: 'doublea',
    formType: 'double',
    label: '浮点数',
    colType: 'DECIMAL',
    javaType: 'BigDecimal',
    rules: ['double']
  },
  { prop: 'select', formType: 'select', label: '下拉框', colType: 'VARCHAR', javaType: 'String', columnSize: 10 },
  {
    prop: 'radio',
    formType: 'radio-group',
    label: '单选',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 20
  },
  {
    prop: 'checkbox',
    formType: 'checkbox-group',
    label: '多选',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isQuery: false,
    isExport: false
  },
  { prop: 'slider', formType: 'slider', label: '滑块', colType: 'DOUBLE', javaType: 'Double' },
  { prop: 'switcha', formType: 'switch', label: '开关', colType: 'BIT', javaType: 'Boolean', dictType: 1 },
  {
    prop: 'time',
    formType: 'time-picker',
    label: '时间选择器',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 10
  },
  {
    prop: 'time',
    formType: 'time-select',
    label: '时间下拉选择',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 10
  },
  {
    prop: 'iconSelect',
    formType: 'icon-select',
    label: '图标选择',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 100
  },
  {
    prop: 'img',
    formType: 'upload-img',
    label: '图片上传',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isTable: false,
    isQuery: false,
    isImport: false
  },
  {
    prop: 'file',
    formType: 'upload-file',
    label: '文件上传',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isTable: false,
    isQuery: false,
    isImport: false
  },
  { prop: 'year', formType: 'year', label: '年份', colType: 'VARCHAR', javaType: 'String', columnSize: 4 },
  { prop: 'month', formType: 'month', label: '月份', colType: 'VARCHAR', javaType: 'String' },
  {
    prop: 'dates',
    formType: 'dates',
    label: '日期多选',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 50,
    isQuery: false,
    isTable: false,
    isImport: false
  },
  { prop: 'week', formType: 'week', label: '周', colType: 'VARCHAR', javaType: 'String', columnSize: 50 },
  {
    prop: 'datetimerange',
    formType: 'datetimerange',
    label: '日期时间范围',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 200
  },
  {
    prop: 'daterange',
    formType: 'daterange',
    label: '日期范围',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 200
  },
  {
    prop: 'monthrange',
    formType: 'monthrange',
    label: '月份范围',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 200
  },
  {
    prop: 'autocomplete',
    formType: 'autocomplete',
    label: '自动补全输入框',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 200
  },
  {
    prop: 'cascader',
    formType: 'cascader',
    label: '级联选择',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 200,
    isImport: false
  },
  {
    prop: 'color',
    formType: 'color-picker',
    label: '颜色选择',
    colType: 'VARCHAR',
    javaType: 'String',
    columnSize: 20
  },
  {
    prop: 'inputNumber',
    formType: 'input-number',
    label: '数值输入框',
    colType: 'DECIMAL',
    javaType: 'Double',
    rules: ['number']
  },
  { prop: 'rate', formType: 'rate', label: '星级评价', colType: 'INT', javaType: 'Integer' }
]

export const formTypeItems = preselectionColumns.map((i) => {
  return {
    value: i.formType,
    label: i.label
  }
})

export const validRules = [
  { value: 'required', label: '必填' },
  { value: 'int', label: '整数型' },
  { value: 'number', label: '数字类型' },
  { value: 'phone', label: '手机号' },
  { value: 'email', label: '邮箱' },
  { value: 'vin', label: 'VIN码' },
  { value: 'idCard', label: '身份证号' },
  { value: 'carNum', label: '车牌号' }
]

export const designTypeItems = [
  { value: '1', label: '从头开始设计' },
  { value: '2', label: '选择一张表开始设计' }
]
