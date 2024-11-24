<template>
  <div ref="scrollbar">
    <el-scrollbar height="100%" :style="`--main-height: ${scrollerSize.height}px;`">
      <router-view v-slot="{ Component, route }">
        <transition :name="systemStore.layout.mainAnimation" mode="out-in">
          <keep-alive :include="systemStore.keepAliveComponentNameList">
            <component v-if="!systemStore.refresh" :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { ref, watch } from 'vue'
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
    setTimeout(() => {
      systemStore.setRefresh(false)
    }, 300)
  }
)

const scrollerSize = ref(useElementSize(scrollbar))
</script>
<style lang="scss"></style>
