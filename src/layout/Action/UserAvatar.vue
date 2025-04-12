<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="avatar">
      <el-avatar shape="circle" :size="26" fit="cover" :src="avatar" />
      <div class="username">{{ systemStore.user?.name }}</div>
      <el-drawer
        style="min-width: min(90vw, 500px)"
        append-to-body
        v-model="drawerVisible"
        :title="$t('system.user.role')"
        direction="rtl"
      >
        <SwitchRole @close="drawerVisible = false" />
      </el-drawer>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="user" icon="User">{{ $t('layout.personalCenter') }}</el-dropdown-item>
        <el-dropdown-item command="switchRole" icon="Switch">{{ $t('layout.switchRole') }}</el-dropdown-item>
        <el-dropdown-item command="logout" icon="SwitchButton">
          <span style="color: red">{{ $t('layout.logout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { userLogout } from '@/api/system/user'
import defaultAvatar from '@/assets/image/avatar-default.png'
import { computed, ref } from 'vue'
import { getDownloadFileUrl } from '@/utils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SwitchRole from '@/layout/SwitchRole.vue'

const { t } = useI18n()
const systemStore = useSystemStore()
const router = useRouter()

const avatar = computed(() => {
  if (systemStore.user?.avatar)
    return getDownloadFileUrl({
      object: systemStore.user?.avatar
    })
  return defaultAvatar
})

const drawerVisible = ref(false)

function handleCommand(key) {
  if (key === 'user') {
    router.push(`/${import.meta.env.VITE_LAYOUT_ROUTE_NAME}/personalCenter`)
  }
  if (key === 'switchRole') {
    drawerVisible.value = true
  }
  if (key === 'logout') {
    userLogout({
      showSuccessMsg: true,
      successMsg: t('layout.logoutSuccess')
    }).then(() => {
      setTimeout(systemStore.logout, 1000)
    })
  }
}
</script>
<style scoped lang="scss">
.avatar {
  height: 100%;
  display: flex;
  align-items: center;

  .username {
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
