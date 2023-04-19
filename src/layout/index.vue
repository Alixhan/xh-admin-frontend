<script>
import { defineComponent, createVNode } from 'vue'
import Default from './default'
import { useSystemStore } from '@/store/system'

/**
 * 默认布局方式，可调整页面总体布局方式，待实现
 * sxh 2023-4-1
 */
export default defineComponent({
  name: 'layout',
  setup () {
    const systemStore = useSystemStore()
    const layout = {
      Default
    }
    return () => createVNode(layout[systemStore.layout.layoutMode])
  }
})
</script>
