<template>
  <div class="table-column-view">
    <el-scrollbar
      v-if="['add', 'edit'].includes(handleType ?? '')"
      v-show="designType === '1'"
      class="left-scroll-view"
    >
      <div ref="preselectionRef" class="preselection-column-view">
        <div v-for="item in preselectionColumns" :key="item.prop" class="preselection-item" @click="add(item)">
          {{ item.label }}
        </div>
      </div>
    </el-scrollbar>
    <m-table
      :class="`column-table ${tableColumns.length || 'empty-table'}`"
      ref="columnTableRef"
      :columns="columns"
      :is-page="false"
      highlight-current-row
      v-model:data="tableColumns"
      row-key="prop"
      :handle-type="handleType"
    >
      <template #left-action>
        <el-button
          v-if="['add', 'edit'].includes(handleType ?? '') && designType === '1'"
          type="danger"
          icon="delete"
          @click="clear"
        >
          {{ $t('common.clear') }}
        </el-button>
      </template>
    </m-table>
    <el-drawer
      title="字段详情配置"
      size="50%"
      modal-class="drawer-view"
      v-model="visible"
      :modal="false"
      :close-on-click-modal="false"
    >
      <m-form
        ref="columnFormRef"
        :handle-type="handleType"
        :model="currentColumn"
        :columns="getColumns(currentColumn)"
      />
      <el-button style="float: right" type="primary" @click="columnFormRef.submit()">校验</el-button>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup>
import { computed, nextTick, onMounted, onUnmounted, type PropType, ref } from 'vue'
import MTable from '@/components/table/index.vue'
import type { CommonTableColumn } from '@i/components/table'
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash-es'
import useDictDetails from '@/utils/dict'
import { queryDictTypeList } from '@/api/system/dict'
import { type DesignTableColumn, formTypeItems, preselectionColumns, validRules } from '@/views/generator/constant'
import type { CommonFormColumn } from '@i/components/form'
import validate from '@/utils/validate'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { toLowerUnderscore } from '@/utils'

defineOptions({
  name: 'DesignColumn'
})

const props = defineProps({
  handleType: String as PropType<FormHandleType>,
  designType: String as PropType<string>
})

const { t } = useI18n()

const dictTypes = ref([])
const columnFormRef = ref()

queryDictTypeList({
  isPage: false
}).then((res) => {
  dictTypes.value = res.data.list.map((i) => {
    return {
      value: i.id,
      label: i.name
    }
  })
})

const columns = computed<CommonTableColumn<DesignTableColumn>[]>(() => [
  { type: 'index', width: 50 },
  { prop: 'formType', label: '表单类型', itemList: formTypeItems },
  { prop: 'prop', label: '属性名' },
  { prop: 'label', label: '名称' },
  { prop: 'colType', label: '字段类型', itemList: useDictDetails(2) },
  { prop: 'javaType', label: 'Java类型', hidden: false, itemList: useDictDetails(3) },
  { prop: 'remarks', label: '注释' },
  { prop: 'primaryKey', label: '主键', type: 'select', itemList: useDictDetails(1, 'boolean') },
  {
    prop: 'primaryKeyType',
    label: '主键类型',
    itemList: [
      { value: 'auto', label: '自增ID' },
      { value: 'uuid', label: 'UUID' }
    ]
  },
  {
    prop: 'isForm',
    label: '表单',
    itemList: useDictDetails(1, 'boolean'),
    align: 'center',
    editable: true,
    editParam: { size: 'small', type: 'switch' }
  },
  {
    prop: 'isTable',
    label: '列表',
    align: 'center',
    itemList: useDictDetails(1, 'boolean'),
    editable: true,
    editParam: ({ row }) => ({
      size: 'small',
      type: 'switch',
      onChange: () => onChangeIsTable(row)
    })
  },
  {
    prop: 'isQuery',
    label: '查询',
    align: 'center',
    itemList: useDictDetails(1, 'boolean'),
    editable: true,
    editParam: ({ row }) => ({ size: 'small', type: row.isTable ? 'switch' : 'blank' })
  },
  {
    prop: 'isExport',
    label: '导出',
    align: 'center',
    itemList: useDictDetails(1, 'boolean'),
    editable: true,
    editParam: ({ row }) => ({ size: 'small', type: row.isTable ? 'switch' : 'blank' })
  },
  {
    prop: 'isImport',
    label: '导入',
    align: 'center',
    editable: true,
    itemList: useDictDetails(1, 'boolean'),
    editParam: { size: 'small', type: 'switch' }
  },
  { prop: 'dictType', label: '数据字典', type: 'select', itemList: dictTypes },
  {
    type: 'operation',
    fixed: 'left',
    align: 'center',
    maxCount: 3,
    buttons: [
      {
        type: 'primary',
        label: '配置明细',
        icon: 'edit',
        onClick: (row) => {
          currentColumn.value = row
          visible.value = true
        }
      },
      {
        type: 'danger',
        icon: 'delete',
        hidden: props.designType === '2' || !['add', 'edit'].includes(props.handleType ?? ''),
        label: '删除',
        onClick: (row, { $fullIndex }) => {
          tableColumns.value.splice($fullIndex, 1)
        }
      },
      {
        type: 'primary',
        icon: 'rank',
        hidden: !['add', 'edit'].includes(props.handleType ?? ''),
        label: '拖拽排序',
        class: 'sort-btn',
        style: 'cursor: move'
      }
    ]
  }
])

function getColumns(column?: DesignTableColumn): CommonFormColumn<DesignTableColumn>[] {
  if (!column) return []
  const isVirtual = !!column.isVirtual
  return [
    { label: '表单信息', type: 'separator' },
    {
      prop: 'formType',
      label: '表单类型',
      type: 'select',
      clearable: false,
      itemList: formTypeItems,
      filterable: true,
      onChange: () => changeFormType(column)
    },
    {
      prop: 'dictType',
      label: '数据字典',
      type: 'select',
      itemList: dictTypes,
      rules: { required: ['select', 'radio-group', 'checkbox-group'].includes(column.formType) },
      hidden: !['select', 'radio-group', 'checkbox-group'].includes(column.formType ?? '')
    },
    {
      prop: 'prop',
      label: '属性名',
      rules: [{ required: true, pattern: /^[a-z][a-zA-Z0-9]*$/ }],
      onChange: (val: string) => {
        if (props.designType === '1') column.columnName = toLowerUnderscore(val)
      }
    },
    { prop: 'label', label: '名称', onChange: (val: string) => (column.remarks = val), rules: [{ required: true }] },
    { prop: 'rules', label: '验证规则', type: 'select', multiple: true, itemList: validRules },
    { label: '字段信息', type: 'separator' },
    {
      prop: 'isVirtual',
      label: '虚拟列',
      disabled: props.designType === '2',
      comment: '不会生成数据库字段',
      type: 'switch'
    },
    {
      prop: 'primaryKey',
      label: '主键',
      type: 'switch',
      hidden: isVirtual,
      disabled: props.designType === '2',
      cols: 0.5,
      onChange: () => delete column.primaryKeyType
    },
    {
      prop: 'primaryKeyType',
      label: '主键类型',
      type: 'select',
      disabled: props.designType === '2',
      hidden: isVirtual || !column.primaryKey,
      cols: 0.5,
      itemList: [
        { value: 'auto', label: '自增ID' },
        { value: 'uuid', label: 'UUID' }
      ],
      rules: [{ required: column.primaryKey }]
    },
    {
      prop: 'columnName',
      label: '字段名',
      hidden: isVirtual,
      disabled: props.designType === '2',
      rules: { pattern: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/ }
    },
    {
      prop: 'colType',
      label: '字段类型',
      type: 'select',
      filterable: true,
      disabled: props.designType === '2',
      itemList: useDictDetails(2),
      hidden: isVirtual
    },
    {
      prop: 'columnSize',
      label: '长度',
      hidden: isVirtual,
      disabled: props.designType === '2',
      type: 'number',
      cols: 0.5,
      rules: {
        required: ['VARCHAR'].includes(column.colType ?? ''),
        type: 'int'
      }
    },
    {
      prop: 'decimalDigits',
      label: '小数点',
      hidden: isVirtual,
      disabled: props.designType === '2',
      type: 'number',
      cols: 0.5,
      rules: { type: 'int' }
    },
    {
      prop: 'remarks',
      label: '注释',
      hidden: isVirtual,
      disabled: props.designType === '2',
      rules: { required: true }
    },
    { label: '其他信息', type: 'separator' },
    {
      prop: 'javaType',
      label: 'Java类型',
      hidden: false,
      type: 'select',
      rules: { required: true },
      itemList: useDictDetails(3)
    },
    {
      prop: 'isTable',
      label: '表格列表',
      type: 'switch',
      cols: 0.5,
      onChange: () => onChangeIsTable(column)
    },
    { prop: 'isQuery', label: '简单查询', type: 'switch', cols: 0.5, hidden: !column.isTable },
    { prop: 'isExport', label: '导出', type: 'switch', cols: 0.5, hidden: !column.isTable },
    { prop: 'isForm', label: '表单维护', type: 'switch', cols: 0.5 },
    { prop: 'isImport', label: '导入', type: 'switch', cols: 0.5 }
  ]
}

const preselectionRef = ref()
const columnTableRef = ref()

const visible = ref(false)
const currentColumn = ref<DesignTableColumn>()

// 表单生成列
const tableColumns = defineModel<DesignTableColumn[]>({ default: [] })

function add(item: DesignTableColumn) {
  tableColumns.value.push(genColumn(item))
}

function genColumn(item: DesignTableColumn) {
  const regex = new RegExp(`^(${item.prop})([0-9]*)$`)
  let num = 0
  tableColumns.value.forEach((i) => {
    if (i.prop) {
      const matches = i.prop.match(regex)
      if (matches) {
        num = Math.max(Number(matches[2] || '1'), num)
      }
    }
  })
  num++
  const column = cloneDeep(item)
  column.prop = column.prop + (num === 1 ? '' : num)
  column.columnName = toLowerUnderscore(column.prop)
  column.remarks = column.label + num
  column.isTable ??= true
  column.isQuery ??= true
  column.isForm ??= true
  column.isImport ??= true
  column.isExport ??= true
  return column
}

let sortableInstance: Sortable[] = []

if (['add', 'edit'].includes(props.handleType ?? '')) {
  onMounted(() => {
    const sortable1 = new Sortable(preselectionRef.value, {
      group: {
        name: 'shared',
        pull: 'clone',
        put: false
      },
      animation: 150,
      sort: false
      // onChoose: function (evt) {
      //   console.info(evt.oldIndex)
      // },
      //
      // onUnchoose: function (evt) {
      //   console.info('onUnchoose', evt)
      // }
    })
    const sortable2 = new Sortable(columnTableRef.value.$el.querySelector('.el-table__body-wrapper tbody'), {
      group: 'shared',
      animation: 150,
      handle: '.sort-btn',
      onAdd: function (evt) {
        const column = genColumn(preselectionColumns[evt.oldIndex!]!)
        tableColumns.value.splice(evt.newIndex!, 0, column)
        evt.item.remove()
      },
      onEnd: function (evt) {
        const [column] = tableColumns.value.splice(evt.oldIndex!, 1)
        tableColumns.value.splice(evt.newIndex!, 0, column)
      }
    })
    sortableInstance = [sortable1, sortable2]
  })

  onUnmounted(() => {
    sortableInstance?.forEach((i) => i.destroy())
  })
}

function changeFormType(row: DesignTableColumn) {
  if (!['select', 'radio-group', 'checkbox-group'].includes(row.formType)) {
    delete row.dictType
  }
}

function onChangeIsTable(row: DesignTableColumn) {
  if (!row.isTable) {
    row.isQuery = false
    row.isExport = false
  }
}

async function clear() {
  await ElMessageBox.confirm('确认清空吗列？', { title: '提示', type: 'warning' })
  tableColumns.value = []
}

async function validColumn() {
  for (let i = 0; i < tableColumns.value.length; i++) {
    const row = tableColumns.value[i]
    const res = await validate(row, getColumns(row) as any)
    if (res.error) {
      ElNotification.error({
        title: t('common.tip'),
        message: res.errFields[0].errMsg
      })
      currentColumn.value = row
      visible.value = true
      await nextTick()
      columnFormRef.value.submit()
      return Promise.reject('验证失败')
    }
  }
  return true
}

defineExpose({
  validColumn
})
</script>
<style lang="scss" scoped>
.table-column-view {
  display: flex;
  align-items: stretch;

  .left-scroll-view {
    width: 300px;

    .preselection-column-view {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: start;
      justify-content: flex-start;
    }
  }

  .preselection-item {
    padding: 5px 10px;
    border: var(--el-border-color) solid 1px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .column-table {
    width: 0;
    flex: 1;
    height: 60vh;
  }
}

.empty-table {
  :deep(.el-scrollbar__view) {
    position: relative;
    height: 100%;

    .el-table__body {
      z-index: 5;
      height: 100%;
    }

    .el-table__empty-block {
      transform: translateY(-100%);
      top: 0;
    }
  }
}

:deep(.drawer-view) {
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}
</style>
