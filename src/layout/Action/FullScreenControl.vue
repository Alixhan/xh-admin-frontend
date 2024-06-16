<template>
  <el-icon @click="toggle">
    <m-svg-icon :src="isFullscreen ? ExitFullScreenSvg : FullScreenSvg" inherited />
  </el-icon>
</template>
<script setup>
import { useFullscreen } from '@vueuse/core'
import FullScreenSvg from '@/assets/icon/full-screen.svg'
import ExitFullScreenSvg from '@/assets/icon/exitfullscreen.svg'

const { isFullscreen, toggle } = useFullscreen()
</script>
<style scoped lang="scss"></style>
