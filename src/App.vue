<template>
  <!-- 全局主题，国际化等配置 -->
  <el-config-provider :locale="locale" :size="systemStore.layout.size" :button="btnConfig">
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import { computed, reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useSystemStore } from '@/store/system'

const systemStore = useSystemStore()

const localeObj = {
  'zh-cn': zhCn,
  en
}
// 语言包
const locale = computed(() => localeObj[systemStore.language])
const btnConfig = reactive({
  autoInsertSpace: false,
})
</script>
