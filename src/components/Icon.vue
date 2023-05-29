<template>
  <el-icon class="icon">
    <component v-if="iconType === 'el' && src" :is="src" />
    <m-svg-icon v-if="iconType === 'local' && src" :src="src" inherited />
  </el-icon>
</template>
<script>
import { ref, shallowRef, watchEffect } from 'vue'

const localSvg = import.meta.glob('@/assets/icon/**/*.svg')
/**
 * 图标表单组件
 * 2023-3-29 sunxh
 */
export default {
  name: 'MIcon',
  props: {
    modelValue: {
      type: String
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const iconType = ref()
    const src = shallowRef()
    watchEffect(initIcon)

    // 初始化icon
    function initIcon() {
      // 实际的表单时是一个用类型和实际组件名或者路径用‘|’拼接的字符串
      const [type, icon] = (props.modelValue ?? '').split('|')
      iconType.value = type
      if (type === 'local') {
        src.value = localSvg[icon]?.().then((r) => r.default)
      }

      if (type === 'el') {
        src.value = icon
      }
    }

    return {
      iconType,
      src
    }
  }
}
</script>
<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
}
</style>
