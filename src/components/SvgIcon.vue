<template>
  <span v-html="svg" />
</template>
<script setup lang="ts">
import { computed, type PropType, ref, toRef, watchEffect } from 'vue'
import fetchBinary from '@/utils/binary'

/**
 * svg图片使用，可动态修改svg节点属性，改变颜色等
 * 2022-7-10 sunxh
 */

defineOptions({
  name: 'MSvgIcon'
})

const props = defineProps({
  src: {
    type: String as PropType<string>,
    required: true
  }, // 图标路径
  property: Object, // 修改svg属性值
  inherited: Boolean // 是否继承当前字体颜色
})

const src = toRef(props, 'src')
const svgBinary = ref('')
let fetch: Promise<string>

watchEffect(async () => {
  fetch = fetchBinary(src.value)
  await fetch
  setBinary()
})

function setBinary() {
  fetch.then((data) => (svgBinary.value = data))
}

const svg = computed(() => {
  if (!svgBinary.value) return ''
  let svgStr = svgBinary.value
  if (props.property) {
    for (const prop in props.property) {
      let index = 0
      const replaceArr = props.property[prop].split(',')
      svgStr = svgStr.replace(new RegExp(`(?<=${prop}=["'])[^"']*(?=["'])`, 'g'), (str) => {
        const v = replaceArr[index]
        index++
        if (v || v === 0) return v
        return str
      })
    }
  } else if (props.inherited) {
    const regExp = /(?<=fill=["'])[^"']*(?=["'])/g
    svgStr = svgStr.replace(regExp, 'currentColor')
  }
  return svgStr
})
</script>
<style scoped>
i {
  display: inline-block;
}

::v-deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
