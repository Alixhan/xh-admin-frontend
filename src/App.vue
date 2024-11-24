<template>
  <!-- 全局主题，国际化等配置 -->
  <el-config-provider :locale="locale" :size="systemStore.layout.size" :button="btnConfig">
    <router-view :class="rootClass" v-slot="{ Component }">
      <transition :name="systemStore.layout.mainAnimation" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <SettingDrawer />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useSystemStore } from '@/stores/system'
import SettingDrawer from '@/layout/SettingDrawer.vue'
import { getLocale } from '@/i18n'

const systemStore = useSystemStore()

// 语言包
const locale = computed(() => getLocale()[systemStore.locale])

const btnConfig = reactive({
  autoInsertSpace: false
})

const rootClass = computed(() => {
  return {
    'width-shrink-layout': systemStore.layout.widthShrink,
    'height-shrink-layout': systemStore.layout.heightShrink
  }
})
</script>
