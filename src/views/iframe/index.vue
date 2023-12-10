<template>
  <div v-loading="loading" style="width: 100%; height: var(--main-height)">
    <iframe class="iframe" :src="src" @load="loading = false" />
  </div>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
defineOptions({
  name: 'IframeView'
})
const systemStore = useSystemStore()
const route = useRoute()
const src = systemStore.menus.find((i) => i.fullPath === route.fullPath).outerUrl
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
