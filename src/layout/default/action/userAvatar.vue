<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="avatar">
      <el-avatar shape="circle" :size="30" fit="cover" :src="avatar" />
      <div class="username">{{ systemStore.user?.name }}</div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="user" icon="User"> 个人中心</el-dropdown-item>
        <el-dropdown-item command="logout" icon="SwitchButton">
          <span style="color: red">注销登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { useSystemStore } from '@/stores/system'
import { userLogout } from '@/api/system/user'
import defaultAvatar from '@/assets/image/avatar-default.png'
import { computed } from 'vue'
import { getDownloadFileUrl } from '@/utils'

const systemStore = useSystemStore()

const avatar = computed(() => {
  if (systemStore.user?.avatar)
    return getDownloadFileUrl({
      object: systemStore.user?.avatar,
    })
  return defaultAvatar
})

function handleCommand(key) {
  if (key === 'user') {
    console.info('个人中心')
  } else if (key === 'logout') {
    userLogout({
      showSuccessMsg: true,
      successMsg: '注销成功',
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
