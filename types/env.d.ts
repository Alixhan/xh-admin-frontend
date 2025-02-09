declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

interface ImportMetaEnv {
  //dev环境
  readonly DEV: boolean
  // 系统名称
  readonly VITE_TITLE: string
  // 系统版本
  readonly VITE_VERSION: string
  // token会存放在localstorage,此项配置存放的key
  readonly VITE_SYS_TOKEN_KEY: string
  // 路由的前缀
  readonly VITE_LAYOUT_ROUTE_NAME: string
  // 请求的前缀
  readonly VITE_BASE_URL: string
  // system服务请求前缀
  readonly VITE_SYSTEM_BASE_URL: string
  // generator服务请求前缀
  readonly VITE_GENERATOR_BASE_URL: string
  // 开发环境前端项目路径
  readonly VITE_FRONTEND_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare type RequestOption<T = any> = import('@i/utils/request').RequestOption<T>
declare type RestResponse<T> = import('@i/utils/request').RestResponse<T>

// declare type ValidRule = import('@/utils/validate').ValidRule
// declare type RuleObject = import('@/utils/validate').RuleObject
// declare type ValidResult = import('@/utils/validate').ValidResult
// declare type FieldValidResult = import('@/utils/validate').FieldValidResult

// declare type CommonColumnType = import('@/components/mutils').CommonColumnType
// declare type CommonColumn = import('@/components/mutils').CommonColumn
// declare type CommonItemList = import('@/components/mutils').CommonItemList
// declare type CommonItemData = import('@/components/mutils').CommonItemData
// declare type CommonModelParam = import('@/components/mutils').CommonModelParam

declare type PageQuery = import('@i/utils/request').PageQuery
declare type TableSelection = import('@i/components/table').TableSelection
declare type TableColumn<T extends object = any> = import('@i/components/table').TableColumn<T>
declare type CommonTableColumn<T extends object = any> = import('@i/components/table').CommonTableColumnn<T>

declare type FormHandleType = import('@i/components/form').FormHandleType
declare type CommonFormColumn<T extends object = any> = import('@i/components/form').CommonFormColumn<T>
