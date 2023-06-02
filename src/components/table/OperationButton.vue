<template>
  <div class="operation-button">
    <template v-for="(item, index) in arr1" :key="index">
      <el-divider v-if="index !== 0" direction="vertical" />
      <el-link :underline="false" v-bind="item">{{ item.label }}</el-link>
    </template>
    <template v-if="arr2.length">
      <el-divider direction="vertical" />
      <el-dropdown>
        <el-link :underline="false" type="primary">
          <span>
            更多 <el-icon><Arrow-down /></el-icon>
          </span>
        </el-link>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(i, index2) in arr2" :key="index2" :="i" :style="`color: var(--el-color-${i.type})`">
              {{ i.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { auth as auth2 } from '@/directive'
import { ElDropdown, ElDropdownMenu, ElLink } from 'element-plus'

/**
 * 操作按钮，主要简化表格按钮的控制，超出的按钮归纳在更多的下拉菜单里
 * sxh
 * 2023-5-27
 */

defineOptions({
  inheritAttrs: false,
  name: 'MOperationButton'
})

export interface OperationButton {
  type?: 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  label: string
  icon?: string
  auth?: string | string[]
  authLogic?: 'and' | 'or'
  authFull?: boolean
  onClick?: any
  disabled?: ((row: any) => boolean) | any
}

export interface Props {
  readonly auth?: boolean
  readonly row?: object
  readonly maxCount?: number
  readonly buttons: OperationButton[]
}

const props = withDefaults(defineProps<Props>(), {
  auth: false,
  maxCount: 2
})

// 需要收纳
const storage = ref(false)
const arr1 = ref<Array<OperationButton>>([])
const arr2 = ref<Array<OperationButton>>([])
let buttons: any[] = props.buttons.map((i) => {
  return {
    type: 'primary',
    ...i,
    onClick: () => i.onClick?.(props.row),
    disabled: i.disabled instanceof Function ? i.disabled(props.row) : i.disabled
  }
})
if (props.auth)
  buttons.filter((i) => {
    if (!i.auth) return true
    return auth2(i.auth, i.authLogic, i.authFull)
  })
storage.value = buttons.length > props.maxCount
arr1.value = buttons
if (storage.value) {
  arr1.value = buttons.splice(0, ~~(props.maxCount - 1))
  arr2.value = buttons
}
</script>
<style scoped lang="scss">
.operation-button {
  width: auto;
  display: inline-flex;
  align-items: center;
}
</style>
