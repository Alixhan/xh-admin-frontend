<template>
  <MUpload model-value="file" />
</template>
<script setup>
import MUpload from '@/components/form/Upload.vue'
import { ref } from 'vue'

const file = ref()
</script>
<style lang="scss" scoped></style>
