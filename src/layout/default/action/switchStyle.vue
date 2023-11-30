<template>
  <el-icon class="icon-style">
    <m-svg-icon :src="isDark ? Sun : Moon" inherited @click="isDark = !isDark" />
  </el-icon>
</template>
<script setup>
import { toRef } from 'vue'
import { useSystemStore } from '@/stores/system'
import Sun from '@/assets/icon/sun.svg'
import Moon from '@/assets/icon/moon.svg'

const isDark = toRef(useSystemStore().layout, 'isDark')
</script>
<style scoped>
.icon-style {
  cursor: pointer;
}
</style>
