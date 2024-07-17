<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in systemStore.activeMenuArr" :key="item.fullPath">
      <div class="tag-content">
        <m-icon v-show="systemStore.layout.showNavTabIcon && item.icon" class="tab-icon" :value="item.icon" />
        {{ item.title }}
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
defineOptions({
  name: 'DefaultBreadcrumb'
})
const systemStore = useSystemStore()
</script>
<style scoped lang="scss">
.tag-content {
  display: flex;
  align-items: center;

  .tab-icon {
    display: inline-block;
    margin-right: 0.5em;
  }
}
</style>
