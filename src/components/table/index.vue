<script lang="jsx">
import { createVNode, nextTick, ref, shallowRef, watch, watchEffect } from 'vue'
import {
  generateDynamicColumn,
  generateFormatter,
  generateFormRules,
  getItemListRef,
  vModelValue
} from '@/components/mutils'
import TopFilter from '@/components/TopFilter.vue'
import { useThrottleFn } from '@vueuse/core'
import TableColumnSort from './TableColumnSort.vue'
import ExportExcel from './ExportExcel.vue'
import { useSystemStore } from '@/store/system'
import { ElTable } from 'element-plus'

/**
 * 通用表格组件
 * sxh
 * 2023-3-12
 */
export default {
  name: 'MTable',
  props: {
    formType: {
      type: String,
      default: 'add'
    },
    // 是否是筛选过滤的表格，是：表格包含搜索框，同时布局有间距调整
    isFilterTable: {
      type: Boolean,
    },
    // 是否导出excel
    isExportExcel: {
      type: Boolean,
      default: true
    },
    /**
     * 可选择行的表格 <multiple|single>
     */
    selection: {
      type: String,
    },
    // 导出的文件名
    exportFileName: {
      type: String,
      default: '表格数据.xlsx'
    },
    // 过滤column
    filterColumns: {
      type: Array,
    },
    // 过滤param
    filterParam: {
      type: Object,
    },
    // 表格列定义
    columns: {
      type: Array,
    },
    // 请求后台数据的方法
    fetchData: {
      type: Function
    },
    // 是否默认查询，启动就查询一次
    defaultQuery: {
      type: Boolean,
      default: true
    },
    // 表格数据
    data: {
      type: Array,
    },
    // 分页对象
    pagination: {
      type: Object
    },
    stripe: {
      type: Boolean,
      default: true
    }
  },
  emits: [...ElTable.emits, 'update:data'],
  setup (props, {
    attrs,
    emit,
    slots,
    expose
  }) {
    const systemStore = useSystemStore()
    const pageQuery = ref({
      isPage: true, // 是否分页
      currentPage: 1, // 页码
      pageSize: 20, // 分页大小
      param: props.filterParam ?? {}, // 查询参数
      filters: [] // 高级查询
    })
    watch(() => props.filterParam, val => (pageQuery.value.param = val ?? {}))

    // 表格数据
    const data = ref(props.data || [])
    watch(() => props.data, val => (data.value = val ?? []))
    // watch(() => data, val => props.data && emit('update:data', val))

    // 分页信息对象
    const pagination = ref({
      total: 0,
      currentPage: 1,
      pageSize: 20,
      background: true,
      layout: 'total,sizes,prev,pager,next,jumper',
    })
    if (props.pagination) {
      pagination.value = Object.assign(props.pagination, { ...pagination.value, ...props.pagination })
    }

    watch(
      () => [pageQuery.value.currentPage, pageQuery.value.pageSize],
      ([currentPage, pageSize]) => {
        pagination.value.currentPage = currentPage
        pagination.value.pageSize = pageSize
      },
      { immediate: true }
    )

    const loadingRef = ref(false)
    // 向后端请求表格数据, 函数节流
    const fetchQuery = useThrottleFn(() => {
      if (props.fetchData) {
        props.fetchData(pageQuery.value, { loadingRef }).then(res => {
          const resData = res.data
          if (props.data) {
            emit('update:data', resData.list)
          } else {
            data.value = resData.list
          }
          pagination.value.total = resData.total
        })
      }
    }, 1000)

    // 默认启动就查询
    props.defaultQuery && nextTick(fetchQuery)

    const formRef = ref()
    const tableRef = ref()

    const columns = shallowRef([])
    // 表格列参数
    const tableColumnsParams = shallowRef([])
    watchEffect(initTableColumnsParams)

    const selectionRows = ref([])

    expose({
      tableRef,
      formRef,
      fetchQuery,
    })

    function rowClick (row, column, event) {
      if (props.selection === 'single') {
        selectionRows.value = [row]
        emit('selection-change', selectionRows.value)
      } else if (props.selection === 'multiple') {
        tableRef.value.toggleRowSelection(row)
      }
      emit('row-click', row, column, event)
    }

    function selectionChange (rows) {
      console.info('selectionChange', rows)
      selectionRows.value = rows
      emit('selection-change', selectionRows.value)
    }

    // 初始化表格列参数
    function initTableColumnsParams () {
      columns.value = props.columns.map(column => initCommonColumns(column))
      tableColumnsParams.value = columns.value.map(column => initTableColumnParam(column))
    }

    function initCommonColumns (column) {
      const r = { ...column, }
      if (r.itemList) r.itemList = getItemListRef(r)
      // 递归生成多层级table
      if (column.children?.length) {
        column.children = column.children.map(i => initCommonColumns(i))
      }
      return r
    }

    function initTableColumnParam (column) {
      if (column.hidden) return column
      // column属性
      const tableColumParams = {
        key: column.prop ?? column.type,
        showOverflowTooltip: true,
        ...column,
        slots: { ...column.slots }
      }

      // 递归生成多层级table
      if (tableColumParams.children?.length) {
        tableColumParams.children = tableColumParams.children.map(i => initTableColumnParam(i))
      }

      tableColumParams.required ??= (() => {
        if (column.editParam?.rules) {
          if (column.editParam.rules instanceof Array) {
            return column.editParam.rules.some(i => i.required)
          }
          return column.editParam.rules.required
        }
      })()
      // 优先使用自定义header插槽
      if ((tableColumParams.required || tableColumParams.comment) && !tableColumParams.slots.header) {
        tableColumParams.slots.header ??= () => {
          return (
            <div style="display: flex; align-items: center;">
              {tableColumParams.required ? <span style="color: red">*</span> : null}
              {tableColumParams.label}
              {tableColumParams.comment
                ? <m-comment label={tableColumParams.label} comment={tableColumParams.comment}/>
                : null}
            </div>
          )
        }
      }
      // el-table序号列，自动添加标题，标题居中
      if (tableColumParams.type === 'index') {
        // 默认实现后端分页页码
        if (props.fetchData) {
          tableColumParams.index ??= i => pagination.value.pageSize * (pagination.value.currentPage - 1) + i + 1
        }
      }
      // 默认表格格式化函数
      generateFormatter(tableColumParams)
      // 生成可编辑表格插槽
      initEditFormItemParam(tableColumParams)
      return tableColumParams
    }

    // 生成可编辑column的参数
    function initEditFormItemParam (column) {
      if (!['add', 'edit'].includes(props.formType)) return
      // 如果有定义插槽了，优先使用插槽内容
      if (column?.slots?.default) return
      if (!column.editable) return
      column.slots || (column.slots = {})
      const columnParam = {
        type: column.type,
        prop: column.prop,
        prop2: column.prop2,
        single: column.single,
        label: column.label,
        itemList: column.itemList,
        valueKey: column.valueKey,
        labelKey: column.labelKey,
      }
      let renderArgsC
      if (!(column.editParam instanceof Function)) {
        renderArgsC = generateDynamicColumn({
          ...columnParam,
          ...column.editParam,
        })
      }
      column.slots.default = scope => {
        const prop = `[${scope.$index}].${column.prop}`
        let renderArgs
        let editParam = column.editParam
        if (editParam instanceof Function) {
          editParam = editParam(scope.row, column)
          renderArgs = generateDynamicColumn({
            ...columnParam,
            ...editParam,
          })
        } else {
          renderArgs = renderArgsC
        }
        renderArgs.param = {
          ...renderArgs.param,
          ...vModelValue({
            type: column.type,
            prop2: column.prop2,
            prop: column.prop,
            single: column.single,
          }, scope.row)
        }

        const formItemParam = {
          key: prop || column.type,
          prop,
          style: 'margin-bottom: 0;',
          inlineMessage: true,
          rules: generateFormRules({ label: column.label, rules: editParam?.rules }, scope.row)
        }
        return <el-form-item {...formItemParam}>
          {createVNode(
            renderArgs.component,
            renderArgs.param,
            renderArgs.slots
          )}
        </el-form-item>
      }
    }

    // 生成表格列
    function generateTableColumn (column) {
      if (column.hidden) return null
      if (column.children?.length) {
        column.slots.default = () => column.children.map(i => generateTableColumn(i))
      }
      // 允许用户按照自己的slotName定制
      if (column.slotName && slots[column.slotName]) return slots[column.slotName]()
      const param = {
        ...column,
      }
      delete param.slots
      delete param.children

      const columnSlots = column.slots
      return <el-table-column {...param} v-slots={columnSlots}/>
    }

    // 生成搜索框
    function generateTopFilter () {
      if (props.isFilterTable && props.filterColumns) {
        return (
          <TopFilter
            class="top-filter"
            columns={props.filterColumns}
            v-model:param={pageQuery.value.param}
            onSearch={fetchQuery}
          />
        )
      }
    }

    // 生成合计框
    function generateTotalView () {
      if (pagination.value.layout.includes('total')) {
        const content = [
          <el-icon class="total-icon" size="15"><InfoFilled/></el-icon>,
          <span>总共 <span class="total-text">{pagination.value.total}</span> 条数据</span>
        ]
        if (props.selection) {
          content.push(<span>，已选中<span class="total-text">{selectionRows.value.length}</span>条</span>)
        }
        return <div class="total-view">{content}</div>
      }
    }

    // 生成表格选择列
    function generateSelectionColumn () {
      if (props.selection === 'multiple') {
        return <el-table-column type="selection"/>
      } else if (props.selection === 'single') {
        const slots = {
          default (scope) {
            return <el-radio onClick={e => e.preventDefault()} label={true}
              modelValue={selectionRows.value.includes(scope.row)}><span/></el-radio>
          }
        }
        return <el-table-column type="selection" fixed width="50" key="--" v-slots={slots}/>
      }
    }

    // 生成table
    function generateTableView () {
      const tableParam = {
        ...attrs,
        ...props,
        ref: tableRef,
        data: data.value,
        onRowClick: rowClick,
        onSelectionChange: selectionChange
      }
      // 删除无效属性
      const invalidProps = ['formType', 'isFilterTable', 'isExportExcel', 'selection', 'filterColumns',
        'filterParam', 'columns', 'fetchData', 'defaultQuery', 'pagination']
      invalidProps.forEach(property => {
        delete tableParam[property]
      })
      return (
        <div class={`table-view ${props.isFilterTable ? 'table-view-filter' : ''}`}>
          <div class="table-top">
            <el-scrollbar class="table-scrollbar" view-style="display: flex; justify-content: space-between;">
              <div class="left-action">
                {generateTotalView()}
                {slots['left-action']?.()}
              </div>
              <div class="right-action">
                {slots['right-action']?.()}
                {props.isExportExcel
                  ? (
                    <ExportExcel class="action-btn" pageQuery={pageQuery.value}
                      exportFileName={props.exportFileName}
                      fetchData={props.fetchData} data={data.value} columns={columns.value}/>
                    )
                  : undefined}
                <el-button icon="Operation" type="primary" text class="action-btn">高级筛选</el-button>
                <el-popover
                  trigger="click"
                  hideAfter={0}
                  popper-style="min-width: 100px; width: auto;"
                  v-slots={{
                    reference () {
                      return <el-button type="primary" text icon="operation" class="action-btn">
                            列排序
                      </el-button>
                    }
                  }}
                >
                  <TableColumnSort columns={props.columns}/>
                </el-popover>
              </div>
            </el-scrollbar>
          </div>
          <el-form ref={formRef} class="table-form" model={props.data} scroll-to-error>
            <el-table {...tableParam} v-slots={slots} v-loading={loadingRef.value}
              class={{ 'radio-selection': props.selection === 'single' }}>
              {generateSelectionColumn()}
              {tableColumnsParams.value.map(i => generateTableColumn(i))}
            </el-table>
          </el-form>
          {generatePaginationView()}
        </div>
      )
    }

    /**
     * 生成分页框
     */
    function generatePaginationView () {
      if (pageQuery.value.isPage) {
        return <el-scrollbar class="table-scrollbar pagination" wrap-style="height: auto;">
          <el-pagination
            {...pagination.value}
            small={systemStore.layout.widthShrink}
            layout={pagination.value.layout.split(',').filter(i => i !== 'total').join(',')}
            onCurrentChange={fetchQuery}
            onSizeChange={fetchQuery}
            v-model:current-page={pageQuery.value.currentPage}
            v-model:page-size={pageQuery.value.pageSize}
          />
        </el-scrollbar>
      }
    }

    return () => {
      return (
        <div class={`m-table ${systemStore.layout.heightShrink ? 'height-shrink' : ''}`}>
          {generateTopFilter()}
          {generateTableView()}
        </div>
      )
    }
  }
}
</script>
<style scoped lang="scss">
.m-table {
  height: 100%;
  display: flex;
  flex-direction: column;

  .top-filter {
    border: var(--el-border);
    border-color: rgba(0, 0, 0, 0);
    margin-bottom: 10px;
    border-radius: 5px;
    flex-shrink: 0;
  }

  .table-view {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 0;
    background-color: var(--el-bg-color-overlay);

    .radio-selection {
      :deep(.el-table-column--selection .el-checkbox) {
        visibility: hidden;
      }
    }

    .table-top {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow-x: auto;

      .total-view {
        margin-right: 10px;
        white-space: nowrap;
        border: var(--el-border-width) var(--el-border-style) var(--el-color-primary-light-5);
        border-radius: var(--el-border-radius-base);
        height: var(--el-component-size);
        line-height: var(--el-component-size);
        padding: 0 10px;
        color: var(--el-color-info-light-3);
        font-size: var(--el-font-size-small);
        background-color: var(--el-color-primary-light-9);
        display: flex;
        align-items: center;

        .total-icon {
          color: var(--el-color-primary);
          padding-right: 5px;
        }

        .total-text {
          padding: 0 5px;
          color: var(--el-color-primary);
          font-weight: bold;
        }
      }

      .left-action {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }

      .right-action {
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }

    .table-form {
      --el-component-size: 25px;
      //--el-component-size-large: 40px;
      //--el-component-size-small: 24px;

      flex-grow: 1;
      height: 0;

      :deep(.el-switch) {
        height: var(--el-input-height);
      }

      :deep(.el-form-item__error--inline) {
        margin-left: 0;
      }

      :deep(.el-zoom-in-top-leave-active) {
        transition: none;
      }

      :deep(.el-button) {
        height: var(--el-component-size) !important;
        line-height: var(--el-component-size);
        display: inline-flex;
        padding: 0;
      }
    }

  }

  .table-view-filter {
    border: var(--el-border);
    border-color: rgba(0, 0, 0, 0);
    padding: 15px;
    border-radius: 5px;
  }

  .action-btn {
    padding: 0 4px;
    margin-left: 3px;
    margin-right: 0;

    :deep(span) {
      margin-left: 2px;
    }
  }

  .pagination {
    height: auto;
    padding-top: 10px;
  }
}

.height-shrink {
  .top-filter {
    position: sticky;
    top: 0;
    z-index: 3;
  }

  .table-view {
    height: auto;

    .table-form {
      height: auto;
    }
  }
}

.table-scrollbar {
  width: 100%;

  :deep(.el-scrollbar__thumb) {
    display: none;
  }
}

//.dark {
//  .top-filter, .table-view-filter {
//    border-color: var(--el-border-color);
//  }
//}
</style>
