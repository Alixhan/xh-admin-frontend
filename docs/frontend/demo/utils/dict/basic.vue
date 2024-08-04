<template>
  <div class="el-text">
    <div v-for="item in sfDetail" :key="item.value">{{ item.value }} -- {{ item.label }}</div>
  </div>
</template>

<script setup lang="ts">
import useDictDetails from '@/utils/dict'

const sfDetail = useDictDetails(1)
</script>
