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
        :model-value="$props.modelValue"
        @update:model-value="onModelValue"
        v-bind="{ ...$attrs, ...$props }"
        @focus=";(isFocus = true) & (visible = true)"
        @blur="inputBlur"
      >
        <template #prepend>
          <el-icon size="20">
            <component v-if="iconType === 'el' && iconComp" :is="iconComp" />
            <m-svg-icon v-if="iconType === 'local' && src" :src="src" inherited />
          </el-icon>
        </template>
      </el-input>
    </template>
    <template #default>
      <div @mouseover.stop="active = true" @mouseout.stop="active = false">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
          <div style="display: flex; gap: 10px">
            <el-link
              v-for="(item, index) in icons"
              :key="index"
              :type="currentTab === item.title ? 'primary' : null"
              @click="currentTab = item.title"
            >
              {{ item.title }}
            </el-link>
          </div>
          <div style="margin-left: 20px">
            <el-input size="small" :placeholder="$t('m.form.iconSearch')" v-model="searchValue" />
          </div>
        </div>
        <el-scrollbar class="icon-scroll" height="250px">
          <div class="icon-views">
            <div
              v-for="(icon, index) in currentIcons"
              :title="icon"
              :key="index"
              class="icon-item-view"
              @click="selectIcon(icon)"
            >
              <m-icon :size="20" :model-value="`${currentTab}|${icon}`" />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </el-popover>
</template>
<script>
import { computed, nextTick, ref, shallowRef, watchEffect } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import MIcon from '@/components/Icon.vue'
import { round } from 'lodash-es'
import MSvgIcon from '@/components/SvgIcon.vue'
// element图标
const localSvg = import.meta.glob('@/assets/icon/**/*.svg', { as: 'url' })
/**
 * 图标表单组件
 * 2023-3-29 sunxh
 */
export default {
  name: 'MIconSelect',
  components: { MSvgIcon, MIcon },
  props: {
    modelValue: {
      type: String
    },
    readonly: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const width = ref()
    const isFocus = ref()
    const visible = ref()
    const active = ref(false)
    const iconType = ref()
    const src = ref()
    const searchValue = ref()
    const iconComp = shallowRef()
    const currentTab = shallowRef('')

    // 初始化一下选择icon
    const icons = ref([
      { title: 'el', items: Object.keys(ElementPlusIconsVue) },
      { title: 'local', items: Object.keys(localSvg) }
    ])
    currentTab.value = icons.value[0].title

    watchEffect(initIcon)

    // 初始化icon
    function initIcon() {
      // 实际的表单时是一个用类型和实际组件名或者路径用‘|’拼接的字符串
      const [type, icon] = (props.modelValue ?? '').split('|')
      iconType.value = type
      if (type === 'local') {
        src.value = localSvg[icon]?.().then((r) => r)
      }

      if (type === 'el') {
        iconComp.value = icon
      }
    }

    function onModelValue(val) {
      emit('update:modelValue', val)
    }

    function updateVisible() {
      isFocus.value || (visible.value = false)
    }

    const refInput = ref()

    function inputRef(el) {
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

    function selectIcon(icon) {
      emit('update:modelValue', `${currentTab.value}|${icon}`)
      visible.value = false
      active.value = false
      nextTick(() => {
        refInput.value.blur()
      })
    }

    function inputBlur() {
      isFocus.value = false
      active.value || (visible.value = false)
    }

    return {
      width,
      updateVisible,
      isFocus,
      visible,
      active,
      iconType,
      src,
      iconComp,
      onModelValue,
      inputRef,
      searchValue,
      icons,
      currentTab,
      currentIcons,
      selectIcon,
      inputBlur
    }
  }
}
</script>
<style scoped lang="scss">
.icon-scroll {
  margin-right: -5px;
  padding-right: 5px;
}

.icon-views {
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .icon-item-view {
    padding: 5px;
    border: var(--el-border);
    border-radius: 2px;
    transition: all 200ms ease-in-out;
    cursor: pointer;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
