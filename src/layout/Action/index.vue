<template>
  <div class="action-view">
    <Search />
    <Github class="action-item" />
    <FullScreenControl class="action-item" />
    <SwitchStyle class="action-item" />
    <SwitchLocale class="action-item" />
    <UserAvatar class="action-item" />
    <Setting class="action-item" />
  </div>
</template>
<script setup>
import Github from './Github.vue'
import FullScreenControl from './FullScreenControl.vue'
import UserAvatar from './UserAvatar.vue'
import SwitchStyle from './SwitchStyle.vue'
import Setting from './Setting.vue'
import SwitchLocale from './SwitchLocale.vue'
import Search from './Search.vue'

defineOptions({
  name: 'DefaultLayout'
})
</script>
<style scoped lang="scss">
@use './action.scss';
</style>
