<template>
</template>

<script setup>

/**
 * 操作按钮，主要简化表格按钮的控制，超出的按钮归纳在更多的下拉菜单里
 * sxh
 * 2023-5-27
 */
const props = defineProps({
  // 最多显示按钮数，超出的将被折叠展示
  maxCount: {
    type: Number,
    default: 2
  },
  buttons: {
    type: Array,
    required: true
  }
})
</script>
<style scoped lang="scss"></style>
