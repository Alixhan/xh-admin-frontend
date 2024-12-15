<script setup>
import DefaultTheme from 'vitepress/theme'
import Footer from '@/layout/Footer.vue'
import { useSystemStore } from '@/stores/system'
import { computed, reactive } from 'vue'
import { getLocale } from '@/i18n/index'
import './app.scss' // 样式引入

const systemStore = useSystemStore()

// 语言包
const locale = computed(() => getLocale()[systemStore.locale])

const btnConfig = reactive({
  autoInsertSpace: false
})

const version = import.meta.env.VITE_VERSION
</script>

<template>
  <el-config-provider :locale="locale" :size="systemStore.layout.size" :button="btnConfig">
    <DefaultTheme.Layout>
      <template #home-hero-info-after>
        <div style="margin-top: 10px">
          当前版本： <el-tag effect="dark" round style="font-weight: bold;">{{ version }}</el-tag>
        </div>
      </template>
      <template #layout-bottom>
        <div style="text-align: center">
          <Footer />
        </div>
      </template>
    </DefaultTheme.Layout>
  </el-config-provider>
</template>
