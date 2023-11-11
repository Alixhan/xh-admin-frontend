import { nextTick, ref } from 'vue'

const isLoading = ref(false)

export const loading = {
    show: () => {
        const bodyE = document.body
        const div = document.createElement('div')
        div.className = 'block-loading'
        div.innerHTML = `
          <div class="dot-view">
            <div class="dot-item dot-item1"></div>
            <div class="dot-item dot-item2"></div>
            <div class="dot-item dot-item3"></div>
            <div class="dot-item dot-item4"></div>
          </div>
          <div style="margin-top: 10px; font-size: var(--el-font-size-base)">正在加载..</div>
          <style>
            .block-loading {
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
                grid-gap: 5px;
                grid-template-rows: repeat(2, 10px);
                grid-template-columns: repeat(2, 10px);
                animation: xz 1.5s infinite linear;
            }

            .dot-item{
                background-color: var(--el-color-primary);
                width: 100%;
                height: 100%;
                border-radius: 50%;
                animation: bs 1.5s infinite linear;
            }
            .dot-item2{
                animation-delay: 0.4s;
            }
            .dot-item3{
                animation-delay: 0.8s;
            }
            .dot-item4{
                animation-delay: 1.2s;
            }

            @keyframes xz {
                from {
                    transform: rotateX(50deg) rotate(0);
                }
                to {
                    transform: rotateX(50deg) rotate(360deg);
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
            const el = document.querySelector('.block-loading')
            el && el.parentNode?.removeChild(el)
        })
    },
    delayHide: () => {
        if (isLoading.value) {
            isLoading.value = false
            setTimeout(() => loading.hide(), 1000)
        }
    }
}
