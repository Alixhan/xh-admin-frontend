<template>
  <div ref="scrollbar">
    <el-scrollbar height="100%" :style="`--main-height: ${scrollerSize.height}px;`">
      <template v-for="i in iframeTabs" :key="i.fullPath">
        <IframeView
          v-if="!systemStore.refresh || route.fullPath !== i.fullPath"
          v-show="route.fullPath === i.fullPath"
          :src="i.outerUrl"
        />
      </template>
      <router-view v-slot="{ Component, route }">
        <transition :name="systemStore.layout.mainAnimation" mode="out-in">
          <keep-alive :include="systemStore.keepAliveComponentNameList">
            <component
              v-if="!systemStore.refresh && !(route.meta.handleType === 'iframe' && route.meta.cache)"
              :is="Component"
              :key="route.fullPath"
            />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { computed, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import IframeView from '@/views/iframe/index.vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'LayoutMain'
})

const route = useRoute()
const systemStore = useSystemStore()
const scrollbar = ref()

//开启缓存的 iframe 菜单需要额外处理
const iframeTabs = computed(() => {
  return systemStore.navTabs.filter((nav) => nav.handleType === 'iframe' && nav.cache)
})

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
