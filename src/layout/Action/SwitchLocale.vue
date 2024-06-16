<template>
  <el-dropdown trigger="click" @command="handleCommand" style="padding: 0">
    <div class="switch-locale-view">
      <component :is="menus[systemStore.locale].icon" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(menu, key) in menus"
          :command="key"
          :key="key"
          :icon="menu.icon"
          :style="key === systemStore.locale ? 'color: var(--el-color-primary)' : ''"
        >
          {{ menu.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="jsx">
import { useSystemStore } from '@/stores/system'
import { locales } from '@/i18n'
import { useI18n } from 'vue-i18n'
import { switchLocale } from '@/api/system/user'

const menus = locales.reduce((obj, i) => {
  obj[i.key] = {
    label: i.label,
    icon: (
      <el-icon>
        <m-svg-icon src={i.icon} inherited />
      </el-icon>
    )
  }
  return obj
}, {})

const systemStore = useSystemStore()

const i18n = useI18n()

//切换语言
async function handleCommand(key) {
  const locale = locales.find((i) => i.key === key)
  if (systemStore.loginStatus === 'success') {
    await switchLocale(
      {
        locale: locale.key,
        localeLabel: locale.label
      },
      {
        errorMsg: i18n.t('layout.switchLocaleError')
      }
    )
  }
  i18n.locale.value = key
  systemStore.setLocale(key)
}
</script>
<style scoped lang="scss">
.switch-locale-view {
  min-width: 16px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
