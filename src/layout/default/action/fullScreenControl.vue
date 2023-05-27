<template>
  <m-svg-icon
    class="icon-style"
    :src="isFullscreen ? ExitFullScreenSvg : FullScreenSvg"
    inherited
    @click="toggle"
  />
</template>
<script setup>
import { useFullscreen } from '@vueuse/core'
import FullScreenSvg from '@/assets/icon/full-screen.svg'
import ExitFullScreenSvg from '@/assets/icon/exitfullscreen.svg'

const { isFullscreen, toggle } = useFullscreen()
</script>
<style scoped lang="scss">
.icon-style {
  width: 20px;
  height: 20px;
}
</style>
