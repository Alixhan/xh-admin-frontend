<template>
  <div class="el-text">
    <MIconSelect v-model="value" style="width: 450px" />
    <el-icon color="red" size="30">
      <MIcon :value="value" />
    </el-icon>
    <el-icon color="var(--el-color-success)" size="20">
      <MIcon :value="value" />
    </el-icon>
    <MIcon :value="value" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import MIconSelect from '@/components/form/IconSelect.vue'
import MIcon from '@/components/Icon.vue'

const value = ref()
</script>
<style scoped>
.el-text {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
