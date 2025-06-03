<template>
  <div class="role-view" ref="rolesRef">
    <div
      v-for="(item, i) in orgRoles"
      :key="`${item.sysOrgId}_${item.sysRoleId}`"
      class="role-item"
      :class="{ 'active-item': item.active }"
      @click="switchRole(item)"
    >
      <el-text> {{ item.orgName }} -- {{ item.roleName }}</el-text>
      <div class="btn-view">
        <el-tag v-if="i === 0" type="info">{{ $t('layout.defaultRole') }}</el-tag>
        <!--        <el-tag v-if="item.active" type="primary">{{ $t('layout.activeRole') }}</el-tag>-->
        <el-link class="sort-btn" underline="never" @click="switchRole(item)" icon="rank" title="拖拽排序" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSystemStore } from '@/stores/system.js'
import { onMounted, onUnmounted, ref, toRef } from 'vue'
import Sortable from 'sortablejs'
import { roleSort } from '@/api/system/user.js'

const emits = defineEmits(['close'])

const systemStore = useSystemStore()

const orgRoles = toRef(systemStore, 'orgRoles')

const rolesRef = ref()
let sortable
onMounted(() => {
  sortable = new Sortable(rolesRef.value, {
    animation: 150,
    sort: true,
    onSort: function (evt) {
      const [row] = orgRoles.value.splice(evt.oldIndex, 1)
      orgRoles.value.splice(evt.newIndex, 0, row)
      sortRole()
    },
    handle: '.sort-btn'
    //
    // onUnchoose: function (evt) {
    //   console.info('onUnchoose', evt)
    // }
  })
})

onUnmounted(() => sortable?.destroy())

//角色切换
function switchRole(orgRole) {
  if (!orgRole.active) {
    systemStore.switchRole(orgRole).then(() => {
      emits('close')
    })
  }
}

// 角色排序
function sortRole() {
  roleSort(orgRoles.value.map((i) => `${i.sysOrgId}_${i.sysRoleId}`).join(','), {
    showSuccessMsg: true,
    successMsg: '排序成功！',
    errorMsg: '排序失败！'
  })
}
</script>
<style scoped lang="scss">
.role-view {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .role-item {
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    border: var(--el-border);
    padding: 10px;
    cursor: pointer;
    height: 1.5em;
    line-height: 1.5em;

    .btn-view {
      display: flex;
      gap: 10px;

      .sort-btn {
        cursor: move;
      }
    }
  }

  .active-item {
    cursor: default;
    border: 1px solid var(--el-color-primary);

    .el-text {
      color: var(--el-color-primary);
    }
  }
}
</style>
