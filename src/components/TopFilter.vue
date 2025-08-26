<template>
  <div class="filter-view">
    <el-scrollbar max-height="45vh">
      <div
        style="overflow: hidden"
        @scroll="(e: any) => (e.target.scrollTop = 0)"
        :style="!expand && `height: calc(${elComponentSizeCssVar} + 14px);`"
      >
        <m-form ref="topFilterFormRef" :columns="columns" :model="param" @keyup="keyup" label-position="right">
          <template v-for="(_, name) in $slots" #[name]="scopedData">
            <slot :name="name" v-bind="scopedData"></slot>
          </template>
          <template #top-btn="hasMore">
            <div class="filter-btn">
              <el-button
                v-if="hasMore"
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
          </template>
        </m-form>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'
import { useElComponentSizeCssVar } from '@/utils'
import MForm from '@/components/form/index.vue'
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

async function search() {
  if (systemStore.layout.heightShrink) expand.value = false
  await topFilterFormRef.value.submit()
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
:deep(.el-form-item) {
  margin-bottom: 14px !important;

  .el-form-item__error {
    font-size: 10px !important;
  }
}

.filter-view {
  background-color: var(--el-bg-color);
  padding: 14px 15px 0 15px;
  overflow: hidden;
}

.filter-btn {
  flex-grow: 1;
  text-align: right;
}
</style>
