import { nextTick } from 'vue'
import '@/styles/loading.scss'

export const loading = {
  show: () => {
    const bodyE = document.body
    const div = document.createElement('div')
    div.className = 'block-loading'
    div.innerHTML = `
      <div class="block-loading-box">
      <div style="margin-bottom: 10px;">啦啦啦啦~~</div>
        <div class="block-loading-box-warp">
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
          <div class="block-loading-box-item"></div>
        </div>
      </div>
    `
    bodyE.insertBefore(div, bodyE.childNodes[0])
    window.existLoading = true
  },
  hide: () => {
    return nextTick(() => {
      const el = document.querySelector('.block-loading')
      el && el.parentNode?.removeChild(el)
    })
  },
}
