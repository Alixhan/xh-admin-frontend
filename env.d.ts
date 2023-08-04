declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare type RequestOption = import('@/utils/request').RequestOption

declare type ValidRule = import('@/utils/validate').ValidRule
declare type RuleObject = import('@/utils/validate').RuleObject
declare type ValidResult = import('@/utils/validate').ValidResult
declare type FieldValidResult = import('@/utils/validate').FieldValidResult

declare type CommonColumnType = import('@/components/mutils').CommonColumnType
declare type CommonColumn = import('@/components/mutils').CommonColumn
declare type CommonItemList = import('@/components/mutils').CommonItemList
declare type CommonItemData = import('@/components/mutils').CommonItemData
declare type CommonModelParam = import('@/components/mutils').CommonModelParam

declare type TableColumn = import('@/components/table').TableColumn
declare type OperationButton = import('@/components/table').OperationButton
declare type PageQuery = import('@/components/table').PageQuery
declare type PageResult = import('@/components/table').PageResult
declare type TablePagination = import('@/components/table').TablePagination
declare type TableSelection = import('@/components/table').TableSelection

declare type FormColumn = import('@/components/form').FormColumn
