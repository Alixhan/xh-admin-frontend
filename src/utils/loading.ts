import { nextTick, ref } from 'vue'

const isLoading = ref(false)

export const loading = {
  show: () => {
    const bodyE = document.body
    const div = document.createElement('div')
    div.className = 'loading-view'
    div.innerHTML = `
          <div class="dot-view">
            <div class="dot-item dot-item1"></div>
            <div class="dot-item dot-item2"></div>
            <div class="dot-item dot-item3"></div>
            <div class="dot-item dot-item4"></div>
          </div>
          <div class="dot-view shadow-view">
            <div class="dot-item dot-item1"></div>
            <div class="dot-item dot-item2"></div>
            <div class="dot-item dot-item3"></div>
            <div class="dot-item dot-item4"></div>
          </div>
          <div style="margin-top: 10px; font-size: var(--el-font-size-base)">Loading..</div>
          <style>
            .loading-view {
              position: fixed;
              display: flex;
              flex-direction: column;
              width: 100vw;
              height: 100vh;
              z-index: 9990;
              background-color: var(--el-bg-color);
              justify-content: center;
              align-items: center;
            }
            
            .dot-view{
                display: inline-grid;
                gap: 5px;
                grid-template-rows: repeat(2, 10px);
                grid-template-columns: repeat(2, 10px);
                animation: xz 1.5s infinite linear;
            }
            
            .shadow-view{
                margin-top: -12px;
                >div{
                filter: blur(4px)
                }
            }

            .dot-item{
                background-color: var(--el-color-primary);
                width: 100%;
                height: 100%;
                border-radius: 50%;
                animation: bs 1.5s infinite linear;
                transform-style: preserve-3d;
            }
            .dot-item2{
                animation-delay: 0.3s;
            }
            .dot-item3{
                animation-delay: 0.7s;
            }
            .dot-item4{
                animation-delay: 1.1s;
            }

            @keyframes xz {
                from {
                    transform: perspective(100px) rotateX(55deg) rotate(0);
                }
                to {
                    transform: perspective(100px) rotateX(55deg) rotate(360deg);
                }
            }
            @keyframes bs {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.2;
                }
            }
           </style>
        `
    bodyE.insertBefore(div, bodyE.childNodes[0])
    isLoading.value = true
  },
  hide: () => {
    return nextTick(() => {
      const el = document.querySelector('.loading-view')
      el?.parentNode?.removeChild(el)
    })
  },
  delayHide: () => {
    if (isLoading.value) {
      isLoading.value = false
      setTimeout(() => loading.hide(), 800)
    }
  }
}
