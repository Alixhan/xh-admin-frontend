<template>
  <el-tabs
    class="nav-tabs"
    :model-value="route.fullPath"
    type="card"
    @tab-click="(e) => router.push(e.props.name)"
    @tab-remove="navTab.removeTab"
  >
    <el-tab-pane
      v-for="(tab, index) in navTabs"
      :key="tab.fullPath"
      :label="tab.title"
      :name="tab.fullPath"
      :closable="navTabs.length > 1"
      @click="router.push(tab.fullPath)"
      class="tab-item"
      lazy
    >
      <template #label>
        <div @contextmenu.prevent="navTab.onContextmenu($event, index)" class="label-view">
          <m-icon v-if="systemStore.layout.showNavTabIcon && tab.icon" class="tab-icon" :value="tab.icon" wrap />
          <div>{{ tab.title }}</div>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const navTabs = systemStore.navTabs

const navTab = inject('navTab')
</script>
<style scoped lang="scss">
.nav-tabs {
  --el-tabs-header-height: auto;
  margin-bottom: 10px;

  :deep(.el-tabs__header) {
    margin: 0;
    border: none;

    .el-tabs__nav {
      border: none;
      gap: 5px;

      .el-tabs__item {
        border: none;
        padding: 10px;
        margin: 0;

        &::before {
          position: absolute;
          content: '';
          left: 0;
          bottom: 0;
          height: 2px;
          background-color: var(--el-color-primary);
          transition: width 0.2s ease-in-out;
          width: 0;

          animation: live 0.2s none;
          animation-play-state: paused;
        }

        &.is-active,
        &:hover {
          background-color: var(--el-color-primary-light-9);

          &::before {
            width: 100%;
          }
        }

        &.is-active::before {
          animation-play-state: running;
        }
      }
    }
  }
}

.label-view {
  display: flex;
  gap: 10px;
  line-height: 1em;
}

@keyframes live {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
