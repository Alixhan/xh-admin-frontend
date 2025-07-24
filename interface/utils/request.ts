import type {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInterceptorOptions,
  AxiosError
} from 'axios'
import type { FilterRow } from '@i/components/table'

/**
 * axios实例重载定义
 */
interface MyAxiosInterceptorManager<V> extends Omit<AxiosInterceptorManager<V>, 'use'> {
  use(
    onFulfilled?: (value: AxiosResponse<V>) => V | Promise<V>,
    onRejected?: (error: AxiosError<V>) => any,
    options?: AxiosInterceptorOptions
  ): number
}
export interface MyAxiosInstance<T, Q> extends Omit<AxiosInstance, 'interceptors'> {
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig<Q>>
    response: MyAxiosInterceptorManager<RestResponse<T>>
  }
  getUri(config?: AxiosRequestConfig): string
  request<R = RestResponse<T>, D = Q>(config: AxiosRequestConfig<D>): Promise<R>
  get<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  delete<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  head<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  options<R = RestResponse<T>, D = Q>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  post<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  put<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  patch<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  postForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  putForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
  patchForm<R = RestResponse<T>, D = Q>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
}

/**
 * 通用请求参数
 */
export interface RequestOption<R = any> {
  // 是否显示loading
  showLoading?: boolean
  // 加载中文本
  loadingText?: string
  // vue3中的ref,会动态更新此值标记请求为loading状态
  loadingRef?: import('vue').Ref<boolean>
  // 请求前是否显示确认弹框，如点击否，则请求取消
  showBeforeConfirm?: boolean
  // 确认弹框按钮文字信息
  confirmButtonText?: string
  // 确认弹框的提示信息
  confirmMsg?: string
  // 显示成功的消息
  showSuccessMsg?: boolean
  // 成功消息的存续时间
  successDuration?: number
  // 成功的提示信息 | res为响应的返回值
  successMsg?: string | ((res: RestResponse<R>) => string)
  // 失败消息的存续时间
  errorDuration?: number
  // 失败的提示信息 | res为响应的返回值
  errorMsg?: string | ((res: ErrorResponse<R>) => string)
}

/**
 * 响应状态
 */
export type ResponseStatus = 'success' | 'error' | 'warning' | 'info'

/**
 * 通用响应
 */
export interface RestResponse<R = any> {
  // http状态码
  readonly httpCode: number
  // 响应消息状态
  readonly status: ResponseStatus
  // 响应的消息内容
  readonly message?: string
  // 响应的数据
  readonly data?: R
}

/**
 * 错误响应类型
 */
export type ErrorResponse<R = any> = string | (RestResponse<R> & { error?: string })

/**
 * 判断是否是 RestResponse 类型
 * @param val
 */
export function isRestResponse(val: any): val is RestResponse & { error?: string } {
  return (val as RestResponse)?.status !== undefined
}

/**
 * 通用列表查询请求参数
 */
export interface PageQuery<T extends object = object> {
  // 是否为导出请求
  isExport?: boolean
  // 是否分页
  isPage: boolean
  // 当前页码 分页为true时必有值
  currentPage?: number
  // 分页大小 分页为true时必有值
  pageSize?: number
  // 其他查询参数
  param?: T
  // 高级筛选条件
  filters?: Array<FilterRow>
  // 排序字段
  orderProp?: string
  // 排序方向
  orderDirection?: 'asc' | 'desc'
}

/**
 * 通用列表查询响应对象类型
 */
export interface PageResult<T extends object = object> {
  // 列表数据
  list: T[]
  // 合计值
  total: number
  // 是否分页
  isPage: boolean
  // 当前页码 分页为true时必有值
  currentPage?: number
  // 分页大小 分页为true时必有值
  pageSize?: number
}

/**
 * 查询分页数据方法
 */
export type FetchPageDataFun<T extends object> = (
  pageQuery: PageQuery,
  option: RequestOption<T>
) => Promise<RestResponse<PageResult<T>>>
