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
          <el-icon class="collapse-icon" size="14">
            <m-svg-icon
              src="@/assets/icon/fold.svg"
              @click="toggleMenuCollapse"
              inherited
              :class="{ rotate180: systemStore.layout.menuCollapse }"
            />
          </el-icon>
          <component
            :is="tabStyleComp[systemStore.layout.tabStyle]"
            v-if="systemStore.layout.heightShrink && !systemStore.layout.widthShrink"
            key="nav-tabs"
            style="width: 0; flex-grow: 1"
            class="nav-tabs"
          />
          <Breadcrumb v-else-if="!systemStore.layout.widthShrink" class="breadcrumb" />
        </div>
      </div>
      <el-link v-if="isDev" style="margin-right: 10px" @click="cp">
        {{ route.meta.component }}
      </el-link>
      <Action class="action" />
    </div>
    <component
        :is="tabStyleComp[systemStore.layout.tabStyle]"
        v-if="!systemStore.layout.heightShrink"
        key="nav-tabs"
        class="nav-tabs"
    />
  </div>
</template>
<script setup>
import Action from '@/layout/default/action'
import NavTabs from './navTabs'
import NavTabs2 from './navTabs2'
import Breadcrumb from './breadcrumb'
import { useSystemStore } from '@/stores/system'
import { toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useClipboard, usePermission } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import MSvgIcon from '@/components/SvgIcon.vue'

defineOptions({
  name: 'DefaultHeader'
})
const { copy } = useClipboard()
usePermission('clipboard-write')

const tabStyleComp = {
  square: NavTabs,
  mellow: NavTabs2
}

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
  padding: 10px;

  .header-top {
    display: flex;
    align-items: center;

    .collapse-icon {
      margin-right: 15px;
      cursor: pointer;
      z-index: 2;
    }

    .rotate180 {
      transform: rotate(180deg);
    }

    .header-left {
      flex-grow: 1;
      width: 0;

      .nav-view {
        display: inline-flex;
        align-items: center;
      }
    }

    .action {
      flex-shrink: 0;
      box-shadow: none;
    }
  }

  .nav-tabs {
    margin-top: 5px;
  }
}

.width-shrink-layout,
.height-shrink-layout {
  .nav-tabs {
    font-size: 12px;
  }
}
</style>
