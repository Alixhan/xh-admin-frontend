import axios from 'axios'
import { useSystemStore } from '@/stores/system'
import { ElLoading, ElMessageBox, ElNotification } from 'element-plus'
import { isRef } from 'vue'
import i18n from '@/i18n'

const { t } = i18n.global

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

/**
 * 通用响应
 */
export interface RestResponse<T> {
  readonly httpCode: number; //http状态码
  readonly status: 'success' | 'error' | 'warning' | 'info'; //响应消息状态
  readonly message?: string; //响应的消息内容
  readonly data: T; //响应的数据
}

export interface RequestOption {
  // 是否显示loading
  showLoading?: boolean;
  // vue3中的ref,会动态更新此值标记请求为loading状态
  loadingRef?: import('vue').Ref<boolean>;
  // 提交前是否显示确认弹框
  showBeforeConfirm?: boolean;
  // 确认弹框按钮文字信息
  confirmButtonText?: string;
  // 确认弹框的提示信息
  confirmMsg?: string;
  // 加载中文本
  loadingText?: string;
  // 显示成功的消息
  showSuccessMsg?: boolean;
  // 成功消息的存续时间
  successDuration?: number;
  // 成功的提示信息 | res为请求的返回值
  successMsg?: string | ((res: any) => string);
  // 失败消息的存续时间
  errorDuration?: number;
  // 失败的提示信息 | res为请求的返回值
  errorMsg?: string | ((res: any) => string);
}

const defaultOption: RequestOption = {
  showLoading: false,
  loadingRef: undefined,
  showBeforeConfirm: false,
  confirmButtonText: '确定',
  confirmMsg: '确认是否继续此操作?',
  loadingText: '操作中',
  showSuccessMsg: false,
  successDuration: 3000,
  successMsg: '操作成功',
  errorDuration: 3000,
  errorMsg: '操作失败'
}

// 对请求进行增强处理
export default function createAxios(opt?: RequestOption) {
  const option: RequestOption = { ...defaultOption, ...opt }
  let loadingInstance

  // 重置loading
  function resetLoading() {
    isRef(option.loadingRef) && (option.loadingRef.value = false)
    loadingInstance?.close()
    //解除占用，防止内存泄漏
    option.loadingRef = undefined
  }

  // 提示错误信息
  function showErrorMsg(e) {
    if (e === 'cancel') return Promise.reject(e)
    let type = e?.status ?? 'error'
    if (!['success', 'warning', 'error', 'info'].includes(type)) type = 'error'
    ElNotification({
      duration: defaultOption.errorDuration,
      type,
      message: e?.error ?? e?.message ?? option.errorMsg,
      onClose() {
        // 需要重新登录
        if (e.httpCode === 401) {
          const systemStore = useSystemStore()
          systemStore.logout()
        }
      }
    })
    return Promise.reject(e)
  }

  // 创建axios实例
  const service = axios.create({
    // // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_BASE_URL // 超时
  })

  // request拦截器
  service.interceptors.request.use(async (config) => {
    if (option.showBeforeConfirm) {
      // 确认的提示
      await ElMessageBox.confirm(option.confirmMsg, t('common.tip'), {
        type: 'warning'
      })
    }
    isRef(option.loadingRef) && (option.loadingRef.value = true)
    if (option.showLoading) {
      loadingInstance = ElLoading.service({
        body: true,
        fullscreen: true,
        lock: true,
        text: defaultOption.loadingText
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
      if (data.status !== 'success') return showErrorMsg(data)
      if (option.showSuccessMsg) {
        ElNotification({
          type: 'success',
          message: option.successMsg instanceof Function ? option.successMsg(data) : option.successMsg,
          duration: defaultOption.successDuration
        })
      }
      return data
    },
    (e) => {
      resetLoading()
      return showErrorMsg(e?.response?.data ?? e)
    }
  )
  return service
}
