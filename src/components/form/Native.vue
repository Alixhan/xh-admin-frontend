<template>
  <component v-if="type !== 'blank'" :is="type" v-bind="$attrs">
    {{ modelValue }}
  </component>
</template>
<script setup lang="tsx">
defineOptions({ name: 'MNative' })
defineProps(['type', 'modelValue'])
</script>
