<template>
  <el-icon class="collapse-icon" size="14" @click="toggleMenuCollapse">
    <m-svg-icon src="@/assets/icon/fold.svg" inherited :class="{ rotate180: systemStore.layout.menuCollapse }" />
  </el-icon>
</template>

<script setup>
import { toRef } from 'vue'
import { useSystemStore } from '@/stores/system'
import MSvgIcon from '@/components/SvgIcon.vue'

const systemStore = useSystemStore()

const menuCollapse = toRef(systemStore.layout, 'menuCollapse')

function toggleMenuCollapse() {
  menuCollapse.value = !menuCollapse.value
}
</script>

<style scoped lang="scss">
.rotate180 {
  transform: rotate(180deg);
}
</style>
