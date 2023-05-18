<template>
  <el-scrollbar ref="scrollbar" class="main" :view-style="systemStore.layout.heightShrink?null:'height: 100%;'">
    <router-view v-slot="{ Component, route }">
      <transition :name="systemStore.layout.mainAnimation" mode="out-in">
        <keep-alive :include="systemStore.keepAliveComponentNameList">
          <component v-if="!systemStore.refresh" :is="Component" :key="route.meta.menuId"/>
        </keep-alive>
      </transition>
    </router-view>
  </el-scrollbar>
</template>

<script setup>
import { useSystemStore } from '@/store/system'
import { nextTick, ref, watch } from 'vue'

const systemStore = useSystemStore()
const scrollbar = ref()
// 刷新当前页签
watch(
  () => systemStore.refresh,
  () => {
    scrollbar.value.update()
    nextTick(() => {
      systemStore.setRefresh(false)
    })
  })
</script>

<style scoped lang="scss">
</style>
