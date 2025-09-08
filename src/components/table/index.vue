<script lang="tsx">
import {
  computed,
  createVNode,
  defineComponent,
  nextTick,
  provide,
  type Ref,
  ref,
  shallowRef,
  type SlotsType,
  toRef,
  type VNode,
  watch
} from 'vue'
import {
  generateDynamicColumn,
  generateFormatter,
  generateFormRules,
  generateLabelWidth,
  getItemListRef,
  vModelValue
} from '@/components/mutils'
import TopFilter from '@/components/TopFilter.vue'
import QueryFilter from '@/components/table/queryFilter/index.vue'
import ExportExcel from './ExportExcel.vue'
import MOperationButton from './OperationButton.vue'
import TableColumnSort from './TableColumnSort.vue'
import { useSystemStore } from '@/stores/system'
import { ElForm } from 'element-plus'
import { auth } from '@/directive'
import { isUndefined } from 'lodash-es'
import { DefaultMaxCount } from '@/components/constants'
import { useI18n } from 'vue-i18n'
import { getCurrentLocales } from '@/i18n'
import validateFrom from '@/utils/validate'
import type { PageQuery, PageResult, RestResponse } from '@i/utils/request'
import type {
  CI,
  CommonTableColumn,
  MTableProps,
  TableColumn,
  TablePagination,
  TableSortColumn
} from '@i/components/table'
import { mTableProps } from '@i/components/table'
import { type ContextMenuItem, showContextMenu } from '@/utils/context-menu'
import type { UnknownFieldRule } from '@i/utils/validate'
import { usePreview } from '@/components/table/queryFilter/queryFilter'

/**
 * 通用表格组件
 * @author sxh 2023-3-12
 */
export default defineComponent(
  <T extends object, F extends object>(props: MTableProps<T, F>, { attrs, emit, slots, expose }) => {
    const { t } = useI18n()
    const systemStore = useSystemStore()
    const pageQuery: Ref<PageQuery<F>> = ref({
      isExport: false,
      isPage: toRef(props, 'isPage').value ?? false, // 是否分页
      currentPage: 1, // 页码
      pageSize: 20, // 分页大小
      param: toRef(props, 'filterParam').value ?? {}, // 查询参数
      filters: [] // 高级查询
    })
    watch(
      () => props.filterParam,
      (val) => (pageQuery.value.param = val ?? {})
    )

    // 表格数据
    const data = ref(toRef(props, 'data').value ?? []) as Ref<T[]>
    watch(
      () => props.data,
      () => (data.value = props.data ?? [])
    )

    // 当前分页数据
    const pageData = computed(() => {
      if (!props.fetchData) {
        if (props.isPage) {
          const start = pageQuery.value.pageSize! * (pageQuery.value.currentPage! - 1)
          return data.value.slice(start, start + pageQuery.value.pageSize!)
        }
      }
      return data.value
    })

    // 分页信息对象
    const pagination = ref<TablePagination>({
      total: 0,
      currentPage: 1,
      pageSize: 20,
      pageSizes: [5, 10, 20, 50, 100, 1000],
      background: true,
      layout: 'total,sizes,prev,pager,next,jumper'
    })
    if (props.pagination) {
      pagination.value = Object.assign(props.pagination, {
        ...pagination.value,
        ...props.pagination
      })
      if (pagination.value.defaultPageSize) pageQuery.value.pageSize = pagination.value.defaultPageSize
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

    // 可用的高级筛选条件
    const enabledPageQuery = computed(() => {
      return {
        ...pageQuery.value,
        filters: enabledFilters.value
      }
    })

    // 向后端请求表格数据
    async function fetchQuery() {
      if (props.fetchData) {
        await props.fetchData(enabledPageQuery.value, { loadingRef }).then((res: RestResponse<PageResult<T>>) => {
          const resData = res.data!
          if (props.data) {
            emit('update:data', resData.list)
          } else {
            data.value = resData.list
          }
          pagination.value.total = resData.total
          selectionChange([])
        })
      }
    }

    // 默认启动就查询
    if (props.defaultQuery) nextTick(fetchQuery)
    const queryFilterRef = ref()
    const formRef = ref()
    const tableRef = ref()
    const exportExcelRef = ref()

    // 表格列参数
    const tableColumnsParams: Ref<CommonTableColumn<T>[]> = shallowRef([])

    // 表格列参数_id寻址
    const tableColumnsParamsObj: Ref<{ [field: string]: CommonTableColumn<T> }> = shallowRef({})

    //排序筛选列定义
    const sortColumns: Ref<TableSortColumn[]> = ref([])

    const sortColumnsParams = computed(() => getSortColumnsParams(sortColumns.value))

    //叶子节点列
    const leafColumns: Ref<CommonTableColumn<T>[]> = ref([])

    provide('leafColumns', leafColumns.value)

    const { enabledFilters } = usePreview(pageQuery.value.filters ?? [], leafColumns.value)

    initTableColumnParamFun()

    watch(() => [props.columns, systemStore.layout.size], initTableColumnParamFun, { deep: true })

    //选中行的数据
    const selectionRows: Ref<T[]> = ref([])

    function rowClick(row: T, column: CommonTableColumn<T>, event: Event) {
      if (props.selection === 'single') {
        selectionRows.value = [row]
        emit('selection-change', selectionRows.value)
      } else if (props.selection === 'multiple') {
        // if (
        //   !isUndefined(props.selectionLimit) &&
        //   selectionRows.value.length >= props.selectionLimit &&
        //   !selectionRows.value.some((i) => i === row)
        // ) {
        //   return
        // }
        // tableRef.value.toggleRowSelection(row)
      }
      emit('row-click', row, column, event)
    }

    //处理选中事件
    function selectionChange(rows: T[]) {
      selectionRows.value = rows
      emit('selection-change', selectionRows.value)
    }

    //超出选择限制禁用其他行选中
    function selectable(row: T) {
      if (isUndefined(props.selectionLimit)) return true
      if (selectionRows.value.length >= props.selectionLimit) {
        return selectionRows.value.some((i) => i === row)
      }
      return true
    }

    //后端排序
    function onSortChange({ prop, order }) {
      pageQuery.value.orderProp = leafColumns.value.find((i) => i.prop === prop)?.alias ?? prop
      const orderDirectionMap = { ascending: 'asc', descending: 'desc' }
      pageQuery.value.orderDirection = orderDirectionMap[order]
      fetchQuery()
    }

    //列表头右击
    function onHeaderContextmenu(column: any, e: PointerEvent) {
      if (column.property) {
        e.preventDefault()
        const menus = [
          { id: 2, prop: column.property, label: t('m.table.ascending'), icon: 'ArrowUp' },
          { id: 3, prop: column.property, label: t('m.table.descending'), icon: 'ArrowDown' }
          // { id: 4, prop: column.property, label: t('common.hide'), icon: 'Hide' }
        ]
        if (props.isComplexFilter && props.fetchData) {
          menus.unshift({ id: 1, prop: column.property, label: t('m.table.complexFilter'), icon: 'Filter' })
        }
        showContextMenu({
          clientX: e.clientX,
          clientY: e.clientY,
          menus,
          onClick: clickMenu
        })
      }
    }

    function clickMenu(menu: ContextMenuItem) {
      if (menu.id === 1) {
        queryFilterRef.value.addRow(menu.prop)
      }
      if (menu.id === 2) {
        tableRef.value.sort(menu.prop, 'ascending')
      }
      if (menu.id === 3) {
        tableRef.value.sort(menu.prop, 'descending')
      }
      // if (menu.id === 4) {
      //   sortColumns.value.find(i => )
      //   tableRef.value.sort(menu.prop, 'descending')
      // }
    }

    //调用初始化表格列的参数
    function initTableColumnParamFun(): void {
      const columns: CommonTableColumn<T>[] = []
      if (props.selection) {
        columns.push({
          type: 'selection',
          selection: props.selection
        })
      }
      columns.push(...props.columns)
      tableColumnsParamsObj.value = {}
      leafColumns.value.splice(0, leafColumns.value.length)
      tableColumnsParams.value = initTableColumnParam(columns)
      initSortColumnFun()
    }

    //初始化表格列的参数
    function initTableColumnParam(cols: TableColumn<T>[], parentId = '') {
      const charWidth = getCurrentLocales().getCharWidth()
      return cols
        .map((column, i) => {
          // el-table序号列，自动添加标题，标题居中
          const r = { ...column }
          r._id = parentId + i
          if (r.type === 'index') {
            r.label ??= t('m.table.index')
            r.width ??= 80
            r.showOverflowTooltip ??= false
          }

          if (r.prop) r.sortable ??= props.sortable ? (props.fetchData ? 'custom' : true) : false // 默认排序

          // 没有设置宽度则根据label字数自动设定宽度，这样可以避免标题换行，影响美观
          if (!(r.width ?? r.minWidth) && r.label) {
            r.minWidth = generateLabelWidth(r) + 24
          }

          // 如果是操作列需要生成操作按钮
          if (r.type === 'operation') {
            r.notExport ??= true
            r.label ??= t('m.table.operation')
            r.showOverflowTooltip ??= false
          }

          if (r.itemList) r.itemList = getItemListRef(r)
          return r
        })
        .filter((i) => {
          // 操作类型时，判断如果buttons没有，则隐藏操作列
          if (i.type === 'operation') {
            i.buttons = i.buttons?.filter((j) => {
              if (j.hidden) return false
              if (!j.auth) return true
              return auth(j.auth, j.authLogic)
            })
            if (!i.buttons?.length) return false
            //自动计算一下操作框的宽度
            const buttons = i.buttons.slice(0, i.maxCount ?? DefaultMaxCount)
            if (buttons.length < i.buttons?.length) {
              buttons[buttons.length - 1] = { icon: 'el|more', label: t('common.more') }
            }
            i.width ??= Math.max(
              buttons.reduce(
                (size, item) => size + (item.label?.length ?? 0) * charWidth + (item.icon ? 16 : 0),
                16 + (buttons.length - 1) * 1.5 * charWidth
              ) + 30,
              charWidth * i.label!.length + 32
            )
            return i.buttons?.length
          }
          return true
        })
        .map((column) => {
          // 递归生成多层级table
          if (column.children?.length) {
            column.children = initTableColumnParam(column.children, column._id + '-')
          }

          // column属性
          const tableColumParams = {
            key: column._id,
            showOverflowTooltip: !(column.slotName || column.editable),
            ...column,
            slots: { ...column.slots }
          }

          // 显示必填*号
          tableColumParams.required ??= (() => {
            const rules = column.rules ?? (column.editParam as any)?.rules
            if (rules) {
              if (rules instanceof Array) {
                return rules.some((i) => i.required)
              }
              return rules.required
            }
          })()

          // 优先使用自定义header插槽
          if ((tableColumParams.required || tableColumParams.comment) && !tableColumParams.slots.header) {
            tableColumParams.slots.header ??= () => {
              return (
                <div style="display: inline-flex; align-items: center;">
                  {tableColumParams.required ? <span style="color: red">*</span> : null}
                  {tableColumParams.label}
                  {tableColumParams.comment ? (
                    <m-comment label={tableColumParams.label} comment={tableColumParams.comment} />
                  ) : null}
                </div>
              )
            }
          }

          // el-table序号列，自动添加标题，标题居中
          if (tableColumParams.type === 'index') {
            // 默认实现后端分页页码
            if (props.isPage) {
              tableColumParams.index ??= (i) => pagination.value.pageSize! * (pagination.value.currentPage! - 1) + i + 1
            }
          }
          // 添加选择列
          if (tableColumParams.type === 'selection') {
            tableColumParams.showOverflowTooltip = false
            if (tableColumParams.selection === 'multiple') {
              tableColumParams.selectable ??= selectable
            }
            if (tableColumParams.selection === 'single') {
              tableColumParams.slots.default ??= (scope: CI<T>) => {
                return (
                  <el-radio
                    onClick={(e: Event) => e.preventDefault()}
                    label={true}
                    modelValue={selectionRows.value.includes(scope.row)}
                  >
                    <span />
                  </el-radio>
                )
              }
            }
          }
          // 如果是操作列需要生成操作按钮
          if (tableColumParams.type === 'operation' && !tableColumParams.slots.default) {
            tableColumParams.slots.default = (scope) => {
              const $index = scope.$index
              let $fullIndex = $index
              if (props.isPage) $fullIndex = $index + pagination.value.pageSize! * (pagination.value.currentPage! - 1)
              return createVNode(MOperationButton, {
                ...tableColumParams,
                row: scope.row,
                index: { $index, $fullIndex }
              })
            }
          }
          // 默认表格格式化函数
          generateFormatter(tableColumParams)
          // 生成可编辑表格插槽
          initEditFormItemParam(tableColumParams)
          tableColumnsParamsObj.value[tableColumParams._id!] = tableColumParams
          //叶子节点
          if (!tableColumParams?.children?.length && tableColumParams.prop && tableColumParams.label) {
            leafColumns.value.push(tableColumParams)
          }
          return tableColumParams
        })
    }

    // 生成可编辑column的参数
    function initEditFormItemParam(column: TableColumn<T>) {
      if (!['add', 'edit'].includes(props.handleType ?? '')) return
      // 如果有定义插槽了，优先使用插槽内容
      if (column?.slots?.default) return
      if (!column.editable) return
      if (!column.prop) return
      column.slots ??= {}
      const columnParam: CommonFormColumn = {
        type: column.type as any,
        prop: column.prop,
        prop2: column.prop2,
        label: column.label,
        itemList: column.itemList,
        valueKey: column.valueKey,
        labelKey: column.labelKey
      }
      let renderArgsC: any
      if (!(column.editParam instanceof Function)) {
        renderArgsC = generateDynamicColumn({
          ...columnParam,
          ...column.editParam
        })
      }

      column.slots.default = (scope: CI<T>) => {
        let $index = scope.$index
        if (props.isPage) $index = $index + pagination.value.pageSize! * (pagination.value.currentPage! - 1)
        const prop = `${$index}.${column.prop}`
        let renderArgs: any
        let editParam = column.editParam
        if (editParam instanceof Function) {
          editParam = editParam({ ...scope, $fullIndex: $index, $column: column })
          renderArgs = generateDynamicColumn({
            ...columnParam,
            ...editParam
          })
        } else {
          renderArgs = renderArgsC
        }
        renderArgs.param = {
          ...renderArgs.param,
          ...vModelValue(renderArgs.param, scope.row)
        }
        const formItemParam = {
          prop,
          style: 'margin-bottom: 0;',
          inlineMessage: true,
          rules: generateFormRules({ label: column.label, rules: editParam?.rules }, scope.row)
        }
        return (
          <el-form-item {...formItemParam}>
            {createVNode(renderArgs.component, renderArgs.param, renderArgs.slots)}
          </el-form-item>
        )
      }
    }

    //调用初始化表格筛选排序列数组
    function initSortColumnFun() {
      sortColumns.value = initSortColumn(tableColumnsParams.value)
    }

    // 验证表格数据
    async function validate() {
      for (let i = 0; i < data.value.length; i++) {
        const row = data.value[i]
        const validRules = leafColumns.value
          .filter((i) => i.prop && i.editable && i.editParam)
          .map((column) => {
            let param = column.editParam! as any
            if (param instanceof Function) {
              param = param({ column: column, $index: i, row, $fullIndex: i, $column: column })
            }
            const ruleField: UnknownFieldRule<T, keyof T> = {}
            if (param.rules) {
              ruleField.prop = column.prop as keyof T
              ruleField.label = column.label
              ruleField.rules = param.rules
            }
            return ruleField
          })
        const result = await validateFrom(row, validRules)
        if (result.error) {
          pageQuery.value.currentPage = Math.floor(i / pageQuery.value.pageSize!) + 1
          await nextTick()
          formRef.value.validate()
          return Promise.reject(result)
        }
      }
    }

    //初始化表格筛选排序数组
    function initSortColumn(cols?: TableColumn<T>[]) {
      if (!cols?.length) return cols
      return cols.map((column) => {
        return {
          _id: column._id,
          label: column.label ?? '',
          hidden: column.hidden,
          fixed: column.fixed,
          children: initSortColumn(column.children)
        }
      })
    }

    //初始化表格筛选排序列参数数组
    function getSortColumnsParams(sortColumns?: TableSortColumn[]) {
      return sortColumns
        ?.filter((i) => !i.hidden)
        .map((sortCol) => {
          return {
            ...tableColumnsParamsObj.value[sortCol._id],
            fixed: sortCol.fixed,
            children: getSortColumnsParams(sortCol.children)
          }
        })
    }

    // 生成表格列视图
    function generateTableColumn(sortColumnsParams: CommonTableColumn<T>[]): VNode[] {
      return sortColumnsParams.map((column) => {
        if (column.hidden) return null
        // 允许用户按照自己的slotName定制
        if (column.slotName && slots[column.slotName ?? '']) return slots[column.slotName ?? '']?.()
        if (column.children?.length) {
          column.slots!.default = () => generateTableColumn(column.children!)
        }
        const param = {
          ...column
        }
        delete param.slots
        delete param.children
        return <el-table-column {...param} v-slots={column.slots} />
      }) satisfies VNode[]
    }

    // 生成简单搜索框
    function generateTopFilter() {
      if (props.isFilterTable && props.filterColumns) {
        return (
          <TopFilter
            class="top-filter"
            columns={props.filterColumns}
            param={pageQuery.value.param!}
            loading={loadingRef.value}
            onSearch={fetchQuery}
            v-slots={slots}
          />
        )
      }
    }

    // 生成合计框
    function generateTotalView() {
      if (pagination.value.layout.includes('total')) {
        return (
          <el-button class="total-view" type="primary" plain>
            <span>
              {t('m.table.total')}
              <span class="total-text">{Math.max(pagination.value.total ?? 0, data.value.length)}</span>
              {t('m.table.unit')}
            </span>
            {props.selection && (
              <span
                class={{ exceed_selection: props.selectionLimit && selectionRows.value.length > props.selectionLimit }}
              >
                ，{t('m.table.selected')}
                <span class="total-text">{selectionRows.value.length}</span>
                {props.selectionLimit && (
                  <span>
                    /<span class="total-text">{props.selectionLimit}</span>
                  </span>
                )}
                {t('m.table.unit')}
              </span>
            )}
          </el-button>
        )
      }
    }

    // 生成table
    function generateTableView() {
      const tableParam = {
        onSortChange,
        ...attrs,
        ...props,
        ref: tableRef,
        data: pageData.value,
        onRowClick: rowClick,
        onSelectionChange: selectionChange
      }
      // 删除无效属性
      const invalidProps = [
        'handleType',
        'isFilterTable',
        'isExportExcel',
        'selection',
        'filterColumns',
        'filterParam',
        'columns',
        'fetchData',
        'defaultQuery',
        'pagination',
        'style',
        'class'
      ]
      invalidProps.forEach((property) => {
        delete tableParam[property]
      })
      return (
        <div class={`table-view ${props.isFilterTable ? 'table-view-filter' : ''}`}>
          <ElForm disabled={false} class="table-top">
            <el-scrollbar class="table-scrollbar" view-style="display: flex; justify-content: space-between;">
              <div class="left-action">
                {generateTotalView()}
                {slots['left-action']?.()}
              </div>
              <div class="right-action">
                {slots['right-action']?.()}
                {props.isExportExcel && (
                  <ExportExcel
                    ref={exportExcelRef}
                    class="action-btn"
                    pageQuery={enabledPageQuery.value}
                    exportFileName={props.exportFileName}
                    fetchData={props.fetchData}
                    data={data.value}
                    columns={sortColumnsParams.value}
                  />
                )}
                {props.isComplexFilter && props.fetchData && (
                  <QueryFilter ref={queryFilterRef} v-model={pageQuery.value.filters} onSearch={fetchQuery} />
                )}
                {props.isSortColumn && (
                  <TableColumnSort
                    class="action-btn"
                    columns={sortColumns.value}
                    onRestoreDefault={initSortColumnFun}
                  />
                )}
              </div>
            </el-scrollbar>
          </ElForm>
          <el-form
            ref={formRef}
            class="table-form"
            model={props.data}
            scroll-to-error
            scroll-into-view-options={{ inline: 'center', block: 'center' }}
          >
            <el-table
              {...tableParam}
              v-slots={{
                ...slots,
                default: () => [...generateTableColumn(sortColumnsParams.value), slots.default?.()]
              }}
              onHeaderContextmenu={onHeaderContextmenu}
              // v-loading={loadingRef.value} 发现此处加入loading会导致内存泄漏。。。。
              class={{ 'el-table-view': true, 'radio-selection': props.selection === 'single' }}
            />
          </el-form>
          {generatePaginationView()}
        </div>
      )
    }

    /**
     * 生成分页框
     */
    function generatePaginationView() {
      if (pageQuery.value.isPage) {
        const paginationParam = {
          ...pagination.value,
          disabled: loadingRef.value,
          total: Math.max(pagination.value.total ?? 0, data.value.length),
          size: systemStore.layout.widthShrink ? 'small' : systemStore.layout.size,
          layout: pagination.value.layout
            .split(',')
            .filter((i) => i !== 'total')
            .join(',')
        }
        return (
          <el-scrollbar class={['table-scrollbar', 'pagination']} wrap-style="height: auto;">
            <ElForm disabled={false}>
              <el-pagination
                {...paginationParam}
                onCurrentChange={fetchQuery}
                onSizeChange={fetchQuery}
                v-model:current-page={pageQuery.value.currentPage}
                v-model:page-size={pageQuery.value.pageSize}
              />
            </ElForm>
          </el-scrollbar>
        )
      }
    }

    expose({
      tableRef,
      formRef,
      exportExcelRef,
      fetchQuery,
      validate
    })

    return () => {
      let layout = props.layout ?? 'default'
      if (systemStore.layout.heightShrink) layout = 'auto'
      return (
        <div style={props.style} class={`layout-${layout}`}>
          <div class={`m-table ${props.height ? 'custom-height' : ''}`}>
            {generateTopFilter()}
            {generateTableView()}
          </div>
        </div>
      )
    }
  },
  {
    name: 'MTable',
    inheritAttrs: true,
    props: { ...mTableProps },
    slots: Object as SlotsType<{
      default: void
      'left-action': void
      'right-action': void
    }>,
    emits: ['update:data', 'selection-change', 'row-click']
  }
)
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
    border-radius: var(--el-border-radius-base);
    flex-shrink: 0;
  }

  .table-view {
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
    flex-grow: 1;

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
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-info-light-3);
        display: flex;
        align-items: center;
        user-select: text;
        cursor: default;

        .total-icon {
          color: var(--el-color-primary);
        }

        .total-text {
          color: var(--el-color-primary);
          font-weight: bold;
          margin: auto 5px;
        }

        .exceed_selection {
          .total-text {
            color: var(--el-color-danger);
          }
        }
      }

      .left-action {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }

      .right-action {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }

    .table-form {
      flex-grow: 1;
      height: 0;

      .el-table-view {
        height: 100%;
        max-height: 100%;
      }

      :deep(.el-form-item__error--inline) {
        margin-left: 0;
      }

      :deep(.el-zoom-in-top-leave-active) {
        transition: none;
      }
    }
  }

  .table-view-filter {
    border: var(--el-border);
    border-color: rgba(0, 0, 0, 0);
    padding: 15px;
    border-radius: var(--el-border-radius-base);
  }

  :deep(.action-btn) {
    padding: 0 4px;
    margin-left: 3px;
    margin-right: 0;

    > span {
      margin-left: 2px;
    }
  }

  .pagination {
    height: auto;
    padding-top: 10px;
  }
}

//表格自动高度
.layout-auto {
  .m-table {
    .table-view {
      height: auto;

      .table-form {
        height: auto;
      }
    }
  }
}

//表格伸缩自适应父级高度
.layout-stretch {
  height: 100%;

  .m-table {
    .table-view {
      flex-grow: 1;

      .table-form {
        flex-grow: 1;
        height: 0;
      }
    }
  }
}

//定制高度
.custom-height {
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
    //display: none;
    z-index: 100000;
  }
}
</style>
