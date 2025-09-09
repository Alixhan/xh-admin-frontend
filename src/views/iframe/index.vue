<template>
  <div v-loading="loading" style="width: 100%; height: var(--main-height)">
    <iframe class="iframe" :src="src" @load="loading = false" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'IframeView'
})

defineProps({
  src: {
    type: String,
    required: true
  }
})

const loading = ref(true)
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 100%;
  border-width: 0;
  display: block;
}
</style>
