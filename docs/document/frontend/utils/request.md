# Request 请求

`request.ts` 提供项目统一的请求工具类函数封装 ^link(axios) 使其更符合前后端分离项目的请求交互场景  
此工具函数具有以下特点：

1. 请求拦截器会自动配置鉴权token
2. 响应拦截器会自动处理请求错误，来自后端业务提示消息，登录超时自动跳转至登录页。
3. 可灵活配置请求过程 `loading` 加载状态。
4. 可灵活配置请求前的确认操作，可定制确认消息内容。
5. 可灵活配置请求成功的成功提示，和请求失败的错误提示。
6. 集成 vue3 的 `Ref` 可动态跟踪请求的状态

## 基础使用

:::demo
utils/request/basic
:::

## 加载中蒙版

:::demo
utils/request/loading
:::

## 显示成功的消息

:::demo
utils/request/show-success-msg
:::

## 请求前确认

:::demo
utils/request/confirm
:::

## loadingRef

`loadingRef` 可以跟踪请求的加载状态，这在表单提交时，设置按钮的加载状态特别方便
:::demo
utils/request/loading-ref
:::

## RequestOption 类型定义

```typescript
/**
 * 通用请求配置
 */
export interface RequestOption<R = any> {
    // 是否显示loading
    showLoading?: boolean;
    // 加载中文本
    loadingText?: string;
    // vue3中的ref,会动态更新此值标记请求为loading状态
    loadingRef?: import('vue').Ref<boolean>;
    // 请求前是否显示确认弹框，如点击否，则请求取消
    showBeforeConfirm?: boolean;
    // 确认弹框按钮文字信息
    confirmButtonText?: string;
    // 确认弹框的提示信息
    confirmMsg?: string;
    // 显示成功的消息
    showSuccessMsg?: boolean;
    // 成功消息的存续时间
    successDuration?: number;
    // 成功的提示信息 | res为响应的返回值
    successMsg?: string | ((res: RestResponse<R>) => string);
    // 失败消息的存续时间
    errorDuration?: number;
    // 失败的提示信息 | res为响应的返回值
    errorMsg?: string | ((res: ErrorResponse<R>) => string);
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
    readonly httpCode: number;
    // 响应消息状态
    readonly status: ResponseStatus;
    // 响应的消息内容
    readonly message?: string;
    // 响应的数据
    readonly data?: R;
}

```
