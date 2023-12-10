import type { CountUpOptions } from 'countup.js'
import { CountUp } from 'countup.js'
import type { Ref } from 'vue'
import { effectScope, onMounted, onScopeDispose, ref, watch } from 'vue'

export function useCountUp(count: Ref<number>, option?: CountUpOptions) {
  option = Object.assign(
    {
      duration: 5
    },
    option
  )
  const domRef = ref()
  onMounted(() => {
    const countUpInstance = new CountUp(domRef.value, count.value, option)
    countUpInstance.start()

    const scope = effectScope()
    scope.run(() => {
      watch(
        () => count.value,
        () => {
          countUpInstance.update(count.value)
        }
      )
    })
    onScopeDispose(() => {
      scope.stop()
    })
  })
  return domRef
}
