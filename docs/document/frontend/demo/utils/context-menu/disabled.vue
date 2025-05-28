<template>
  <div class="context-view" @contextmenu.prevent="show">右击此区域任意地方显示上下文菜单</div>
</template>

<script setup lang="ts">
import { showContextMenu } from '@/utils/context-menu'
import { ElMessage } from 'element-plus'

function show(e: MouseEvent) {
  showContextMenu({
    clientX: e.clientX + 50,
    clientY: e.clientY + 30,
    menus: [
      { label: '菜单一', type: 'warning' },
      { label: '菜单二', type: 'danger', disabled: true },
      { label: '菜单三', type: 'success' }
    ],
    onClick(menu: any) {
      ElMessage.success(`点击了${menu.label}`)
    }
  })
}
</script>
<style scoped>
.context-view {
  width: 100%;
  height: 300px;
  background-color: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
