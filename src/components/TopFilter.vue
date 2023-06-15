<script lang="jsx">
import { defineComponent, createVNode, ref, shallowRef, watchEffect } from 'vue'
import { generateDynamicColumn, generatePlaceholder, vModelValue } from '@/components/mutils'
import { useSystemStore } from '@/stores/system'
import { useElementSize } from '@vueuse/core'

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
      type: String,
      default: '7em'
    }
  },
  emits: ['search'],
  setup(props, { emit, expose }) {
    const systemStore = useSystemStore()
    const topFilterRef = ref()
    // 搜索框是否展开
    const expand = ref(false)

    const filterSize = ref(useElementSize(topFilterRef))
    // 搜索列
    const columnsParams = shallowRef([])
    watchEffect(initColumnsParams)

    const colspan = ref(0)
    watchEffect(() => {
      let span = 24 / (Number(Math.floor(filterSize.value.width / 300)) || 1)
      if (span === 4.8) span = 6
      colspan.value = span
    })

    function search() {
      if (systemStore.layout.heightShrink) expand.value = false
      emit('search', props.param)
    }

    // 重置
    function reset() {
      topFilterRef.value.resetFields()
    }

    expose({ reset })

    function initColumnsParams() {
      columnsParams.value = props.columns
        .filter((i) => !i.hidden)
        .map((column) => {
          const { component, param, slots } = generateDynamicColumn(column)
          generatePlaceholder(param)
          const formItemParam = {
            slots: {},
            prop: column.prop,
            label: column.label,
            labelWidth: props.labelWidth
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
        <div class="filter-tabs">
          <div class="filter-title">
            <div class="title-logo"></div>
            <el-text class="title-text" size="large">
              查询
            </el-text>
            <div style="flex-grow: 1; width: 0; text-align: right;">
              <el-button
                icon={expand.value ? 'ArrowUp' : 'ArrowDown'}
                text
                onClick={() => (expand.value = !expand.value)}
                type="primary"
                style="padding: 0 5px;"
              >
                {expand.value ? '收起' : '展开'}
              </el-button>
              <el-button type="primary" onClick={search}>
                搜索
              </el-button>
              <el-button onClick={reset}>重置</el-button>
            </div>
          </div>
          <div class="filter-view" style={`height: ${expand.value ? filterSize.value.height : 0}px;`}>
            <el-form ref={topFilterRef} model={props.param}>
              <el-scrollbar max-height="45vh">
                <el-row>{generateFilterColumn()}</el-row>
              </el-scrollbar>
            </el-form>
          </div>
        </div>
      )
    }
  }
})
</script>
<style scoped lang="scss">
:deep(.el-form-item--default) {
  margin: 5px 0;
}

.filter-btn {
  margin: 5px 0;
  text-align: right;
}

.filter-tabs {
  background-color: var(--el-bg-color);
  padding: 10px 15px;

  .filter-title {
    display: flex;
    align-items: center;
    margin: 5px 0;

    .title-logo {
      width: 7px;
      height: 20px;
      border-radius: 1px;
      background-color: var(--el-color-primary);
    }

    .title-text {
      margin-left: 10px;
      font-weight: bold;
    }
  }

  .filter-view {
    //transition: height 0.2s ease-in-out;
    overflow: hidden;
  }
}
</style>
