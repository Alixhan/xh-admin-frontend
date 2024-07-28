<template>
  <el-scrollbar>
    <div class="nav-tabs">
      <el-tag
        v-for="(tab, index) in navTabs"
        :key="tab.fullPath"
        @contextmenu.prevent="navTab.onContextmenu($event, index)"
        @click="router.push(tab.fullPath)"
        @close="navTab.removeTab(tab.fullPath)"
        :closable="navTabs.length > 1"
        :class="{
          'active-tab': route.fullPath === tab.fullPath
        }"
        class="tab-item"
        :type="route.fullPath === tab.fullPath ? 'primary' : 'info'"
        :effect="route.fullPath === tab.fullPath ? 'dark' : 'plain'"
      >
        <div class="tag-content">
          <m-icon v-if="systemStore.layout.showNavTabIcon && tab.icon" class="tab-icon" :value="tab.icon" />
          {{ tab.title }}
        </div>
      </el-tag>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MIcon from '@/components/Icon.vue'

const systemStore = useSystemStore()
const navTabs = systemStore.navTabs
const route = useRoute()
const router = useRouter()

const navTab = inject('navTab')
</script>
<style scoped lang="scss">
$transition-time: all 0.2s linear;
.nav-tabs {
  padding: 0 0 10px 0;
  height: auto;
  display: inline-flex;
  gap: 10px;
  font-size: var(--el-font-size-base);

  .tab-item {
    padding: 13px 10px;
    user-select: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    transition: $transition-time;
    cursor: pointer;

    .tag-content {
      display: flex;
      align-items: center;

      .tab-icon {
        margin-right: 0.5em;
      }
    }
  }
}
</style>
