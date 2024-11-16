<template>
  <el-popover
    ref="popover"
    placement="bottom"
    trigger="focus"
    :hide-after="0"
    :visible="visible"
    :width="width"
    @update:visible="updateVisible"
  >
    <template #reference>
      <el-input
        :ref="inputRef"
        :model-value="modelValue"
        @update:model-value="onModelValue"
        v-bind="{ ...$attrs, ...$props }"
        @focus="(isFocus = true) && (visible = true)"
        @blur="inputBlur"
      >
        <template #prepend>
          <el-icon size="20">
            <m-icon :value="modelValue" />
          </el-icon>
        </template>
      </el-input>
    </template>
    <template #default>
      <div @mouseover.stop="active = true" @mouseout.stop="active = false">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
          <div style="display: flex; gap: 10px">
            <div
              class="el-link"
              v-for="(item, index) in icons"
              :key="index"
              :style="currentTab === item.title ? 'color: var(--el-color-primary)' : null"
              @click="currentTab = item.title"
            >
              {{ item.title }}
            </div>
          </div>
          <div style="margin-left: 20px">
            <el-input size="small" :placeholder="$t('m.form.iconSearch')" v-model="searchValue" />
          </div>
        </div>
        <el-scrollbar class="icon-scroll" height="250px">
          <div class="icon-views">
            <div
              v-for="(icon, i) in currentIcons"
              :title="icon"
              :key="i"
              class="icon-item-view"
              @click="selectIcon(icon)"
            >
              <m-icon :size="20" :value="`${currentTab}|${icon}`" />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
/**
 * 图标表单组件
 * 2023-3-29 sunxh
 */

import { computed, nextTick, ref, shallowRef } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import MIcon from '@/components/Icon.vue'
import { round } from 'lodash-es'
import type { ElInput } from 'element-plus'

const localSvg = import.meta.glob('@/assets/icon/**/*.svg', { query: '?url', import: 'default' })

defineOptions({
  name: 'MIconSelect'
})

defineProps<{
  modelValue?: string
  readonly?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  //恢复默认
  (e: 'update:modelValue', modelValue: string): void
}>()
const width = ref()
const isFocus = ref()
const visible = ref()
const active = ref(false)
const searchValue = ref()
const currentTab = shallowRef('')

// 初始化一下选择icon
const icons = ref([
  { title: 'el', items: Object.keys(ElementPlusIconsVue) },
  { title: 'local', items: Object.keys(localSvg) }
])
currentTab.value = icons.value[0].title

function onModelValue(val: string) {
  emit('update:modelValue', val)
}

function updateVisible() {
  if (!isFocus.value) visible.value = false
}

const refInput = ref()

function inputRef(el: InstanceType<typeof ElInput>) {
  refInput.value = el
  const clientWidth = el?.$el.clientWidth
  let sl = round(Number(clientWidth) / 41.3, 0)
  if (sl < 8) sl = 8
  width.value = sl * 41.3 - 10
}

const currentIcons = computed(() => {
  let result = icons.value.find((i) => i.title === currentTab.value)?.items ?? []
  if (searchValue.value) {
    result = result.filter((i) => {
      const indexOf = String(i).toLowerCase().indexOf(searchValue.value.toLowerCase())
      return indexOf !== -1
    })
  }
  return result
})

function selectIcon(icon: string) {
  emit('update:modelValue', `${currentTab.value}|${icon}`)
  visible.value = false
  active.value = false
  nextTick(() => {
    refInput.value.blur()
  })
}

function inputBlur() {
  isFocus.value = false
  if (!active.value) visible.value = false
}
</script>
<style scoped lang="scss">
.icon-scroll {
  margin-right: -5px;
  padding-right: 5px;
}

.icon-views {
  padding: 5px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 30px);
}

.icon-item-view {
  box-sizing: border-box;
  display: inline;
  width: 30px;
  height: 30px;
  padding: 5px;
  border: var(--el-border);
  border-radius: 2px;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>
