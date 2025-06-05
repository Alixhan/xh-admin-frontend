<template>
  <div class="operation-button">
    <template v-for="(item, index) in arr1" :key="index">
      <el-divider v-if="index !== 0" direction="vertical" />
      <el-link underline="never" v-bind="getBind(item)">{{ item.label }}</el-link>
    </template>
    <template v-if="arr2.length">
      <el-divider direction="vertical" />
      <el-dropdown :persistent="false">
        <el-link underline="never" type="primary">
          <div style="display: inline-flex; align-items: center">
            {{ $t('common.more') }}
            <el-icon>
              <Arrow-down />
            </el-icon>
          </div>
        </el-link>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(i, index2) in arr2"
              :key="index2"
              :="getBind(i)"
              :style="`color: var(--el-color-${i.type})`"
            >
              {{ i.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </div>
</template>
<script lang="ts" setup generic="T">
import { ref, watch, h } from 'vue'
import { auth as auth2 } from '@/directive'
import { ElDropdown, ElDropdownMenu, ElLink } from 'element-plus'
import { DefaultMaxCount } from '@/components/constants'
import type { OperationButton, OperationButtonProps } from '@i/components/table'
import MIcon from '@/components/Icon.vue'

/**
 * 操作按钮，主要简化表格按钮的控制，超出的按钮归纳在更多的下拉菜单里
 * sxh
 * 2023-5-27
 */

defineOptions({
  inheritAttrs: false,
  name: 'MOperationButton'
})

const props = withDefaults(defineProps<OperationButtonProps<T>>(), {
  auth: false,
  maxCount: DefaultMaxCount
})

// 需要收纳
const storage = ref(false)
const arr1 = ref<Array<OperationButton<T>>>([])
const arr2 = ref<Array<OperationButton<T>>>([])

init()
watch(
  () => [props.buttons, props.buttons.length],
  () => init()
)

function init() {
  arr2.value = []
  const buttons: OperationButton<T>[] = props.buttons
    .filter((i) => !i.hidden)
    .map((i) => {
      return {
        type: 'primary',
        ...i,
        onClick: () => i.onClick?.(props.row!, props.index!),
        disabled: i.disabled instanceof Function ? i.disabled(props.row!) : i.disabled
      }
    })
  if (props.auth) {
    buttons.filter((i) => {
      if (!i.auth) return true
      return auth2(i.auth, i.authLogic)
    })
  }

  storage.value = buttons.length > props.maxCount
  arr1.value = buttons
  if (storage.value) {
    arr1.value = buttons.splice(0, ~~(props.maxCount - 1))
    arr2.value = buttons
  }
}

function getBind(item: OperationButton<T>) {
  const i: any = { ...item }
  if (typeof i.icon === 'string') {
    if (i.icon && i.icon?.indexOf?.('|') != -1) {
      i.icon = h(MIcon, { value: i.icon, wrap: false })
    }
  }
  return i
}
</script>
<style scoped lang="scss">
.operation-button {
  width: auto;
  display: inline-flex;
  align-items: center;
}

:deep(.el-dropdown-menu__item) {
  .el-icon {
    margin-right: 5px;
  }
}
</style>
