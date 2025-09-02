<template>
  <el-drawer size="400px" v-model="systemStore.layout.settingVisible" :title="$t('setting.layout')">
    <el-form label-width="9em" label-position="left">
      <el-form-item :label="$t('setting.theme')" :span="24">
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
      <el-form-item :label="$t('setting.size.label')" :span="24">
        <el-radio-group v-model="systemStore.layout.size">
          <el-radio v-for="i in sizes" :key="i" :value="i" :label="$t('setting.size.' + i)" />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('setting.tabStyle.label')" :span="24">
        <el-radio-group v-model="systemStore.layout.tabStyle">
          <el-radio v-for="i in tabStyles" :key="i" :label="$t('setting.tabStyle.' + i)" :value="i" />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('setting.showLogo')" :span="24">
        <el-switch v-model="systemStore.layout.showLogo" />
      </el-form-item>
      <el-form-item :label="$t('setting.menuUnique')" :span="24">
        <el-switch v-model="systemStore.layout.menuUniqueOpened" />
      </el-form-item>
      <el-form-item :label="$t('setting.showNavTabIcon')" :span="24">
        <el-switch v-model="systemStore.layout.showNavTabIcon" />
      </el-form-item>
      <el-form-item :label="$t('setting.menuWidth')" :span="24">
        <el-input-number v-model="systemStore.layout.menuWidth" :min="150" :max="350" />
      </el-form-item>
      <el-form-item :label="$t('setting.showFooter')" :span="24">
        <el-switch v-model="systemStore.layout.showFooter" />
      </el-form-item>
      <el-form-item :label="$t('setting.menuInvertColor')" :span="24">
        <el-switch v-model="systemStore.layout.menuInvertColor" />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const themeStore = useThemeStore()
const themeList = themeStore.themeList

const tabStyles = ['square', 'mellow', 'lively']
const sizes = ['small', 'default', 'large']

function change(val: string) {
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
  margin: 5px 0;
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

:deep(.el-radio-group) {
  justify-content: flex-end;
}
</style>
