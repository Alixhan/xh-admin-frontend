<template>
  <div
    class="header-view"
    :class="{
      'width-shrink-layout': systemStore.layout.widthShrink,
      'height-shrink-layout': systemStore.layout.heightShrink
    }"
  >
    <div class="header-top">
      <div class="header-left">
        <div class="nav-view">
          <el-icon class="collapse-icon" color="var(--el-color-primary)" size="28">
            <Fold @click="toggleMenuCollapse" :class="{ rotate180: systemStore.layout.menuCollapse }" />
          </el-icon>
          <NavTabs v-if="systemStore.layout.heightShrink" key="nav-tabs" class="nav-tabs" />
          <Breadcrumb v-else-if="!systemStore.layout.widthShrink" class="breadcrumb" />
        </div>
      </div>
      <el-link v-if="isDev" style="margin-right: 10px" @click="cp">
        {{ route.meta.component }}
      </el-link>
      <Action class="action" />
    </div>
    <NavTabs v-if="!systemStore.layout.heightShrink" key="nav-tabs" class="nav-tabs" style="margin-top: 5px" />
  </div>
</template>
<script setup>
import Action from '@/layout/default/action'
import NavTabs from './navTabs'
import Breadcrumb from './breadcrumb'
import { useSystemStore } from '@/stores/system'
import { toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useClipboard, usePermission } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const { copy } = useClipboard()
usePermission('clipboard-write')
function cp() {
  copy(route.meta.component).then(() => {
    console.info('恭喜你！你发现了这个贴心的小功能~👻🏀🐔')
    ElMessage({
      type: 'success',
      message: '已复制到剪切板'
    })
  })
}

const isDev = import.meta.env.DEV
const systemStore = useSystemStore()
const menuCollapse = toRef(systemStore.layout, 'menuCollapse')
const route = useRoute()

function toggleMenuCollapse() {
  menuCollapse.value = !menuCollapse.value
}
</script>
<style scoped lang="scss">
.header-view {
  padding: 10px 10px 10px 10px;

  .header-top {
    display: flex;
    align-items: center;

    .collapse-icon {
      margin-right: 10px;
      cursor: pointer;
    }

    .rotate180 {
      transform: rotate(180deg);
    }

    .header-left {
      flex-grow: 1;
      width: 0;

      .nav-view {
        display: flex;
        align-items: center;
      }
    }

    .action {
      flex-shrink: 0;
      box-shadow: var(--el-box-shadow);
    }
  }
}

.width-shrink-layout,
.height-shrink-layout {
  padding-top: 0;

  .header-top {
    .action {
      box-shadow: none;

      :deep(.action-item) {
        padding: 0 7px;
        border-right: none;
      }
    }
  }

  .nav-tabs {
    :deep(.nav-tabs) {
      font-size: 12px;
      gap: 7px;

      .tab-item {
        padding-top: 7px;
        padding-bottom: 7px;
      }
    }
  }
}

.height-shrink-layout {
  padding-bottom: 0;
}
</style>
