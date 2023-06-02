import axios from 'axios'
import { useSystemStore } from '@/stores/system'
import { ElLoading, ElMessageBox, ElNotification } from 'element-plus'
import { isRef } from 'vue'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

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
  const option: RequestOption = Object.assign({}, defaultOption, opt)
  let loadingInstance

  // 重置loading
  function resetLoading() {
    isRef(option.loadingRef) && (option.loadingRef.value = false)
    loadingInstance?.close()
  }

  // 提示错误信息
  function showErrorMsg(e) {
    if (e === 'cancel') return Promise.reject(e)
    ElNotification({
      duration: defaultOption.errorDuration,
      type: e?.status ?? 'error',
      message: e?.message ?? option.errorMsg,
      onClose() {
        // 需要重新登录
        if (e.httpCode === 403) {
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
      await ElMessageBox.confirm(option.confirmMsg, '提示', {
        type: 'warning'
      })
    }
    isRef(option.loadingRef) && (option.loadingRef.value = true)
    if (option.showLoading) {
      loadingInstance = ElLoading.service({
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
      return showErrorMsg(e)
    }
  )
  return service
}
