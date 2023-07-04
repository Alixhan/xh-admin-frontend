<template>
  <div v-loading="loading" style="width: 100%; height: 100%;">
    <iframe class="iframe" :src="src" @load="loading = false" />
  </div>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { ref } from 'vue'

const systemStore = useSystemStore()
const src = systemStore.menus.find((i) => i.id === systemStore.activeMenuId).outerUrl
const loading = ref(true)
</script>
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 100%;
  border-width: 0px;
  display: block;
}
</style>
