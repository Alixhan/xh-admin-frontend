<template>
  <el-drawer
    style="min-width: min(90vw, 320px); max-width: 320px"
    v-model="systemStore.layout.settingVisible"
    title="布局配置"
  >
    <el-form label-width="6em" label-position="left">
      <el-form-item label="主题" :span="24">
        <div class="theme-view">
          <div
            v-for="item in themeList"
            :key="item.id"
            :title="item.label"
            @click="change(item.id)"
            :style="{
              backgroundColor:
                item.theme?.['--el-color-primary']?.[systemStore.layout.isDark ? 'dark' : 'light'] ?? item.primary
            }"
            :class="{ activeTheme: themeStore.currentTheme === item.id }"
          />
        </div>
      </el-form-item>
      <el-form-item label="显示logo" :span="24">
        <el-switch v-model="systemStore.layout.showLogo" />
      </el-form-item>
      <el-form-item label="手风琴菜单" :span="24">
        <el-switch v-model="systemStore.layout.menuUniqueOpened" />
      </el-form-item>
      <el-form-item label="页签图标" :span="24">
        <el-switch v-model="systemStore.layout.showNavTabIcon" />
      </el-form-item>
      <el-form-item label="菜单宽度" :span="24">
        <el-input-number v-model="systemStore.layout.menuWidth" :min="150" :max="350" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
import { useThemeStore } from '@/stores/theme'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const themeStore = useThemeStore()
const themeList = themeStore.themeList

function change(val) {
  themeStore.changeThemeId(val)
}
</script>
<style scoped lang="scss">
:deep(.el-drawer__header) {
  margin-bottom: 10px !important;
}

.form-item {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 5px;
}

:deep(.el-form-item__content) {
  justify-content: flex-end;
}

.theme-view {
  margin-bottom: 5px;
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 20px);
  justify-content: end;

  > div {
    height: 20px;
    border-radius: 2px;
    position: relative;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .activeTheme {
    &::after {
      content: '';
      width: 3px;
      height: 10px;
      position: absolute;
      right: 7px;
      bottom: 6px;
      border: 2px solid #fff;
      border-radius: 2px;
      border-top-color: transparent;
      border-left-color: transparent;
      transform: rotate(45deg);
    }
  }
}
</style>
