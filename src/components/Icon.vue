<template>
  <el-icon v-if="wrap" class="icon">
    <component v-if="iconType === 'el' && src" :is="src" />
    <svg-icon v-else-if="iconType === 'local' && src" :src="src" inherited />
  </el-icon>
  <template v-else>
    <component v-if="iconType === 'el' && src" :is="src" />
    <svg-icon v-else-if="iconType === 'local' && src" :src="src" inherited />
  </template>
</template>
<script setup lang="ts">
/**
 * 图标展示组件
 * 2023-3-29 sunxh
 */
import { ref, watchEffect } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

const localSvg = import.meta.glob('@/assets/icon/**/*.svg', { query: '?url', import: 'default' })

defineOptions({
  name: 'MIcon'
})

const props = withDefaults(
  defineProps<{
    value?: string
    wrap?: boolean //是否用el-icon组件包裹
  }>(),
  { wrap: true }
)

const iconType = ref()
const src = ref()

watchEffect(initIcon)

// 初始化icon
function initIcon() {
  // 实际的表单时是一个用类型和实际组件名或者路径用‘|’拼接的字符串
  const [type, icon] = (props.value ?? '').split('|')
  iconType.value = type
  if (type === 'local') {
    const val = localSvg[icon]?.()
    if (val instanceof Promise) {
      val.then((i) => (src.value = i))
    } else src.value = val
  }

  if (type === 'el') {
    src.value = icon
  }
}
</script>
