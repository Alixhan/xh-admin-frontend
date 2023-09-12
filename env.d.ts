declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare type RequestOption = import('@/utils/request').RequestOption
declare type RestResponse<T> = import('@/utils/request').RestResponse<T>

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
declare type PageQuery<T = object> = import('@/components/table').PageQuery<T>
declare type PageResult<T = object> = import('@/components/table').PageResult<T>
declare type TablePagination = import('@/components/table').TablePagination
declare type TableSelection = import('@/components/table').TableSelection

declare type FormHandleType = import('@/components/form').FormHandleType
declare type FormColumn = import('@/components/form').FormColumn
