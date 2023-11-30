<template>
  <el-icon>
    <m-svg-icon :src="isFullscreen ? ExitFullScreenSvg : FullScreenSvg" inherited @click="toggle" />
  </el-icon>
</template>
<script setup>
import { useFullscreen } from '@vueuse/core'
import FullScreenSvg from '@/assets/icon/full-screen.svg'
import ExitFullScreenSvg from '@/assets/icon/exitfullscreen.svg'

const { isFullscreen, toggle } = useFullscreen()
</script>
<style scoped lang="scss">
</style>
