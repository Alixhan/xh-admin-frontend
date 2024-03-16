<template>
  <el-scrollbar ref="scrollbar" :style="`--main-height: ${scrollerSize.height}px;`">
    <router-view v-slot="{ Component, route }">
      <transition :name="systemStore.layout.mainAnimation" mode="out-in">
        <keep-alive :include="systemStore.keepAliveComponentNameList">
          <component v-if="!systemStore.refresh" :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-scrollbar>
</template>

<script setup>
import { useSystemStore } from '@/stores/system'
import { nextTick, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
defineOptions({
  name: 'LayoutMain'
})
const systemStore = useSystemStore()
const scrollbar = ref()
// 刷新当前页签
watch(
  () => systemStore.refresh,
  () => {
    nextTick(() => {
      systemStore.setRefresh(false)
    })
  }
)

const scrollerSize = ref(useElementSize(scrollbar))
</script>
<style lang="scss"></style>
