import axios, { AxiosError } from 'axios'
import { useSystemStore } from '@/stores/system'
import type { NotificationParams } from 'element-plus'
import { ElLoading, ElMessageBox, ElNotification } from 'element-plus'
import { isRef } from 'vue'
import i18n from '@/i18n'
import type { ErrorResponse, MyAxiosInstance, RequestOption } from '@i/utils/request'
import { isRestResponse } from '@i/utils/request'
import type { Mutable } from '@vueuse/core'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

function getDefaultOption(): RequestOption {
  const { t } = i18n.global
  return {
    showLoading: false,
    showBeforeConfirm: false,
    confirmButtonText: t('common.confirm'),
    confirmMsg: t('common.confirmMsg'),
    loadingText: t('common.loadingText'),
    showSuccessMsg: false,
    successDuration: 3000,
    successMsg: t('common.successMsg'),
    errorDuration: 3000,
    errorMsg: t('common.optFailed')
  }
}

// 对请求进行增强处理
export default function createAxios<R = any, Q = any>(opt?: RequestOption<R>): MyAxiosInstance<R, Q> {
  const option: RequestOption<R> = { ...getDefaultOption(), ...opt }
  let loadingInstance: { close: () => void }

  // 重置loading
  function resetLoading() {
    if (isRef(option.loadingRef)) option.loadingRef.value = false
    loadingInstance?.close()
    //解除占用，防止内存泄漏
    delete option.loadingRef
  }

  //生成消息
  function handleMsg(msg: string | ((res: any) => string), data: any): string {
    return msg instanceof Function ? msg(data) : msg
  }

  // 提示错误信息
  function showErrorMsg(e: ErrorResponse<R> | AxiosError) {
    if (e === 'cancel') return Promise.reject(e)
    const param: Mutable<NotificationParams> = {
      type: 'error',
      duration: option.errorDuration
    }
    if (isRestResponse(e)) {
      if (['success', 'error', 'warning', 'info'].includes(e?.status)) {
        param.type = e?.status
      }
      param.message = e?.message ?? e?.error ?? handleMsg(option.errorMsg!, e)
      param.onClose = () => {
        // 需要重新登录
        if (e.httpCode === 401) {
          const systemStore = useSystemStore()
          systemStore.logout()
        }
      }
    }
    if (e instanceof AxiosError) {
      param.message = e.message
    }
    param.message ??= 'Error'
    ElNotification(param)
    return Promise.reject(e)
  }

  // 创建axios实例
  const service: MyAxiosInstance<R, Q> = axios.create({
    // // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_BASE_URL // 超时
  }) as MyAxiosInstance<R, Q>

  // request拦截器
  service.interceptors.request.use(async (config) => {
    if (option.showBeforeConfirm) {
      // 确认的提示
      await ElMessageBox.confirm(option.confirmMsg, i18n.global.t('common.tip'), {
        type: 'warning',
        confirmButtonText: option.confirmButtonText
      })
    }
    if (isRef(option.loadingRef)) option.loadingRef.value = true
    if (option.showLoading) {
      loadingInstance = ElLoading.service({
        body: true,
        fullscreen: true,
        lock: true,
        text: option.loadingText,
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    const systemStore = useSystemStore()
    // 添加token
    config.headers[import.meta.env.VITE_SYS_TOKEN_KEY] = systemStore.token
    return config
  })

  // 响应拦截器
  service.interceptors.response.use(
    async (res) => {
      const data = res.data
      resetLoading()
      if (data.status && data.status !== 'success') return showErrorMsg(data)
      if (option.showSuccessMsg) {
        ElNotification({
          type: 'success',
          message: handleMsg(option.successMsg!, data),
          duration: option.successDuration
        })
      }
      return data
    },
    (e) => {
      resetLoading()
      if (e.response) return showErrorMsg(e.response.data)
      return showErrorMsg(e)
    }
  )
  return service
}
