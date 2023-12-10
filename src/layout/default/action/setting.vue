<template>
  <m-svg-icon
    @click="systemStore.layout.settingVisible = true"
    class="icon-style"
    src="@/assets/icon/layoutSetting.svg"
    inherited
  />
</template>
<script setup>
import { useSystemStore } from '@/stores/system'

defineOptions({
  name: 'ActionSetting'
})
const systemStore = useSystemStore()
</script>
<style scoped lang="scss">
.icon-style {
  width: 18px;
  height: 18px;
}
</style>
