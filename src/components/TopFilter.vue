<template>
  <div :class="`filter-tabs ${expand ? 'expand-filter' : ''}`">
    <div v-if="systemStore.layout.widthShrink" class="filter-title" />
    <el-text v-else class="filter-title">
      <m-svg-icon class="title-logo" src="@/assets/icon/search-list.svg" inherited />
      {{ t('m.topFilter.query') }}
    </el-text>
    <div class="filter-view">
      <el-scrollbar max-height="45vh">
        <div style="overflow: hidden" :style="!expand && `height: ${elComponentSizeCssVar};`">
          <m-form ref="topFilterFormRef" :columns="columns" :model="param" @keyup="keyup" label-position="right" />
        </div>
      </el-scrollbar>
    </div>
    <div class="filter-btn">
      <el-button
        :icon="expand ? 'ArrowUp' : 'ArrowDown'"
        text
        @click="() => (expand = !expand)"
        type="primary"
        style="padding: 0 5px"
      >
        {{ expand ? t('m.topFilter.collapse') : t('m.topFilter.expand') }}
      </el-button>
      <el-button type="primary" icon="search" @click="search" :loading="loading">
        {{ t('m.topFilter.search') }}
      </el-button>
      <el-button @click="reset"> {{ t('m.topFilter.reset') }}</el-button>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { type PropType, ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'
import { useElComponentSizeCssVar } from '@/utils'
import MForm from '@/components/form/index.vue'
import MSvgIcon from '@/components/SvgIcon.vue'
import type { CommonFormColumn } from '@i/components/form'

/**
 * 筛选框组件
 * sxh
 * 2023-3-12
 */

defineOptions({
  name: 'MTopFilter'
})

const props = defineProps({
  // 参数对象
  param: {
    type: Object as PropType<object>,
    required: true
  },
  // 过滤列定义
  columns: {
    type: Array as PropType<CommonFormColumn<any>[]>,
    default: () => []
  },
  labelWidth: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'search', param: object): void | Promise<void>
}>()

const { t } = useI18n()
const systemStore = useSystemStore()
const topFilterFormRef = ref()
// 搜索框是否展开
const expand = ref(false)

const elComponentSizeCssVar = useElComponentSizeCssVar()

function search() {
  if (systemStore.layout.heightShrink) expand.value = false
  emit('search', props.param)
}

// 重置
function reset() {
  topFilterFormRef.value.resetFields()
}

function keyup(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    // 回车事件处理逻辑
    search()
  }
}

defineExpose({ reset })
</script>
<style scoped lang="scss">
:deep(.el-form-item--small) {
  margin-bottom: 10px !important;
}

.filter-tabs {
  background-color: var(--el-bg-color);
  padding: 7px 15px 7px 15px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-auto-flow: row dense;
  gap: 10px;
  transition: all 0.2s ease-in-out;
  align-items: center;

  .filter-title {
    display: flex;
    align-items: center;
    color: var(--el-color-primary);

    .title-logo {
      margin-right: 0.4em;
      line-height: 1em;
      width: 1.5em;
      height: 1.5em;
    }
  }

  .filter-view {
    justify-items: end;
    overflow: hidden;
    @media all and (max-width: 400px) {
      height: 0;
    }
  }

  .filter-btn {
    flex-grow: 1;
    text-align: right;
    margin: 5px 0;
  }
}

.expand-filter {
  grid-template-columns: auto 1fr auto;

  .filter-title {
    grid-column-start: span 2;
  }

  .filter-view {
    height: auto;
    overflow: hidden;
    grid-column-start: span 3;
  }
}
</style>
