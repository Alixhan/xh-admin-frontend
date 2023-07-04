<template>
  <!-- 全局主题，国际化等配置 -->
  <el-config-provider :locale="locale" :size="systemStore.layout.size" :button="btnConfig">
    <router-view :class="rootClass" v-slot="{ Component }">
      <transition :name="systemStore.layout.mainAnimation" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import { computed, reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const localeObj = {
  'zh-cn': zhCn,
  en
}
// 语言包
const locale = computed(() => localeObj[systemStore.language])
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
