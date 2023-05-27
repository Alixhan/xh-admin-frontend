<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item v-for="item in systemStore.activeMenuArr" :key="item.id">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
</script>
<style scoped lang="scss">
.breadcrumb {
  font-weight: bold;
}
</style>
