<template>
  <el-drawer
    style="min-width: min(90vw, 300px); max-width: 300px"
    v-model="systemStore.layout.settingVisible"
    title="布局配置"
  >
    <el-form label-width="6em" label-position="left">
      <el-form-item label="主题" :span="24">
        <el-select :model-value="themeStore.currentTheme" @update:model-value="change" class="form-item">
          <el-option v-for="item in themeList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单宽度" :span="24">
        <el-input-number v-model="systemStore.layout.menuWidth" :min="150" :max="350" />
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
.form-item {
  width: 100%;
}

:deep(.el-form-item__content) {
  justify-content: flex-end;
}
</style>
