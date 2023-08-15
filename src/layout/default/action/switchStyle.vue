<template>
  <el-icon @click="isDark = !isDark" size="15" style="cursor: pointer">
    <Sunny v-if="isDark" />
    <Moon v-else />
  </el-icon>
</template>
<script setup>
import { toRef } from 'vue'
import { useSystemStore } from '@/stores/system'

const isDark = toRef(useSystemStore().layout, 'isDark')
</script>
