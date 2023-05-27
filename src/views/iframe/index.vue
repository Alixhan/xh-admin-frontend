<template>
  <div v-loading="loading" style="width: 100%; height: 100%">
    <iframe :src="src" frameborder="0" width="100%" height="100%" @load="loading = false" />
  </div>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { ref } from 'vue'

const systemStore = useSystemStore()
const src = systemStore.menus.find((i) => i.id === systemStore.activeMenuId).outerUrl
const loading = ref(true)
</script>
<style lang="scss" scoped></style>
