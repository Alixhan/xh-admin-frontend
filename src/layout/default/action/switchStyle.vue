<template>
  <el-switch
      class="switch"
      v-model="isDark"
      active-icon="Moon"
      inactive-icon="Sunny"
      inline-prompt
  >
  </el-switch>
</template>
<script setup>
import { toRef } from 'vue'
import { useSystemStore } from '@/store/system'

const isDark = toRef(useSystemStore().layout, 'isDark')
</script>
<style scoped lang="scss">
.switch {
  --el-switch-on-color: #494949;
}
</style>
