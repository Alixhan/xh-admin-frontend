<template>
  <img :src="src" />
</template>

<script setup lang="ts">
import { getDownloadFileUrl } from '@/utils'

const src = getDownloadFileUrl({
  id: 1,
  isScale: true,
  scaleWidth: 100
})
</script>
