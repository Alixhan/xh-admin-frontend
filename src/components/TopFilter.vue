<script lang="jsx">
import { computed, createVNode, defineComponent, ref, shallowRef, watchEffect } from 'vue'
import { generateDynamicColumn, generateLabelWidth, generatePlaceholder, vModelValue } from '@/components/mutils'
import { useSystemStore } from '@/stores/system'
import { useElementSize } from '@vueuse/core'
import QueryIcon from '@/assets/icon/search-list.svg'
import { useI18n } from 'vue-i18n'
import { useElComponentSizeCssVar } from '@/utils'

/**
 * 筛选框组件
 * sxh
 * 2023-3-12
 */
export default defineComponent({
  name: 'MTopFilter',
  props: {
    // 参数对象
    param: {
      type: Object,
      required: true
    },
    // 过滤列定义
    columns: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search'],
  setup(props, { emit, expose }) {
    const { t } = useI18n()
    const systemStore = useSystemStore()
    const topFilterFormRef = ref()
    // 搜索框是否展开
    const expand = ref(false)

    const filterSize = ref(useElementSize(topFilterFormRef))
    // 搜索列
    const columnsParams = shallowRef([])
    watchEffect(initColumnsParams)

    //计算一下labelWidth，以最长label字符宽度作为form的labelWidth
    const labelWidth = computed(() => props.labelWidth ?? generateLabelWidth(...props.columns))

    const colspan = ref(0)

    const elComponentSizeCssVar = useElComponentSizeCssVar()

    watchEffect(() => {
      const width = systemStore.layout.size === 'small' ? 220 : 300
      let span = 24 / (Number(Math.floor(filterSize.value.width / width)) || 1)
      colspan.value = Math.floor(span)
    })

    function search() {
      if (systemStore.layout.heightShrink) expand.value = false
      emit('search', props.param)
    }

    // 重置
    function reset() {
      topFilterFormRef.value.resetFields()
    }

    expose({ reset })

    function initColumnsParams() {
      columnsParams.value = props.columns
        .filter((i) => !i.hidden)
        .map((column) => {
          const { component, param, slots } = generateDynamicColumn(column)
          generatePlaceholder(param)
          const formItemParam = {
            ...column,
            slots: {}
          }
          formItemParam.slots.default = () => {
            const vModelParam = vModelValue(
              {
                type: column.type,
                prop2: column.prop2,
                prop: column.prop,
                single: column.single
              },
              props.param
            )
            return createVNode(component, { ...param, ...vModelParam }, slots)
          }
          return formItemParam
        })
    }

    function keyup(e){
      if (e.key === 'Enter') {
        // 回车事件处理逻辑
        search()
      }
    }

    // 生成column
    function generateFilterColumn() {
      return columnsParams.value.map((i) => {
        let span = i.colspan || colspan.value
        if (systemStore.layout.widthShrink) {
          span = colspan.value
        }
        if (i.cols) span = parseInt(i.cols) * span
        if (span > 24) span = 24
        return (
          <el-col span={span}>
            <el-form-item prop={i.prop} label={i.label} labelWidth={i.labelWidth}>
              {i.slots.default()}
            </el-form-item>
          </el-col>
        )
      })
    }

    return () => {
      return (
        <div class={`filter-tabs ${expand.value ? 'expand-filter' : ''}`}>
          {systemStore.layout.widthShrink ? (
            <div class="filter-title" />
          ) : (
            <el-text class="filter-title">
              <m-svg-icon class="title-logo" src={QueryIcon} property={{ fill: 'var(--el-color-primary)' }} />
              {t('m.topFilter.query')}
            </el-text>
          )}
          <div class="filter-view" style={!expand.value && `height: ${elComponentSizeCssVar.value};`}>
            <el-form ref={topFilterFormRef} model={props.param} labelWidth={labelWidth.value} onKeyup={keyup}>
              <el-scrollbar max-height="45vh">
                <el-row>{generateFilterColumn()}</el-row>
              </el-scrollbar>
            </el-form>
          </div>
          <div class="filter-btn" style="flex-grow: 1; -width: 0; text-align: right;">
            <el-button
              icon={expand.value ? 'ArrowUp' : 'ArrowDown'}
              text
              onClick={() => (expand.value = !expand.value)}
              type="primary"
              style={{ padding: '0 5px' }}
            >
              {expand.value ? t('m.topFilter.collapse') : t('m.topFilter.expand')}
            </el-button>
            <el-button type="primary" icon="search" onClick={search} loading={props.loading}>
              {t('m.topFilter.search')}
            </el-button>
            <el-button onClick={reset}> {t('m.topFilter.reset')}</el-button>
          </div>
        </div>
      )
    }
  }
})
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
    @media all and (max-width: 500px) {
      height: 0;
    }
  }

  .filter-btn {
    margin: 5px 0;
    text-align: right;
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
