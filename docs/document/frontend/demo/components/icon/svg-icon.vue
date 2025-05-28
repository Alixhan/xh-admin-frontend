<template>
  <div class="el-text">
    <m-svg-icon src="@/assets/icon/layoutSetting.svg" class="svg-icon" :property="property" />
    <el-color-picker v-model="color.a" />
    <el-color-picker v-model="color.b" />
    <el-color-picker v-model="color.c" />
    <br/>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import MSvgIcon from '@/components/SvgIcon.vue'

const color = ref({
  a: '#24af02',
  b: '#7505d1',
  c: '#ff0000'
})

const property = computed(() => {
  return {
    fill: `,${color.value.a},${color.value.b},${color.value.c}`
  }
})
</script>
<style scoped>
.el-text {
  display: flex;
  gap: 10px;
  align-items: center;
}

.svg-icon {
  width: 50px;
}
</style>
