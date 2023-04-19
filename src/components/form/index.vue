<script lang="jsx">
import { createVNode, onUnmounted, ref, shallowRef, watchEffect } from 'vue'
import { ElForm } from 'element-plus'
import { generateDynamicColumn, generateFormRules, generatePlaceholder, vModelValue } from '@/components/mutils'
import { useSystemStore } from '@/store/system'
import { useElementSize } from '@vueuse/core'

/**
 * 通用表单组件
 * sxh 2023-3-24
 */
export default {
  name: 'MForm',
  inheritAttrs: false,
  extends: ElForm,
  props: {
    // 表单处理类型， add,edit,detail
    handleType: {
      type: String,
      default: 'add',
    },
    // 跨列数，对应el-col
    colspan: {
      type: Number,
    },
    // 表单对象
    model: {
      type: Object,
      required: true
    },
    // 表格列定义
    columns: {
      type: Array,
      required: true
    },
    labelWidth: {
      type: String,
      default: '9em'
    },
    scrollToError: {
      default: true
    },
    scrollIntoViewOptions: {
      default: { behavior: 'smooth', block: 'center', inline: 'center' }
    }
  },
  emits: [],
  setup (props, {
    attrs,
    slots,
    expose,
    // emit,
  }) {
    const systemStore = useSystemStore()
    onUnmounted(() => {
      formItemParams.value = null
    })

    const formRef = ref()
    const formSize = ref(useElementSize(formRef))
    const colspan = ref(0)
    watchEffect(() => {
      let span = 24 / (Number(Math.floor(formSize.value.width / 300)) || 1)
      if (span === 4.8) span = 6
      colspan.value = span
    })

    const formItemParams = shallowRef([])
    watchEffect(initFormItemParams)

    expose({
      clearValidate: function () {
        return formRef.value.clearValidate(...arguments)
      },
      scrollToField: function () {
        return formRef.value.scrollToField(...arguments)
      },
      resetFields: function () {
        return formRef.value.resetFields(...arguments)
      },
      validateField: function () {
        return formRef.value.validateField(...arguments)
      },
      validate: function () {
        return formRef.value.validate(...arguments)
      },
    })

    function initFormItemParams () {
      formItemParams.value = props.columns.map(i => {
        // 隐藏的直接返回
        if (i.hidden) return i
        const formItemObj = {
          columnParam: i,
          formItemParams: {
            key: i.prop || i.type,
            prop: i.prop,
            label: i.label,
            labelWidth: i.labelWidth,
            required: i.required,
            rules: generateFormRules(i),
          },
          renderArgs: generateDynamicColumn(i)
        }
        generatePlaceholder(formItemObj.renderArgs.param)
        return formItemObj
      })
    }

    function generateFormColumns () {
      return formItemParams.value.map(i => {
        // 隐藏的不显示
        if (i.hidden) return null
        const column = i.columnParam
        // 允许用户按照自己的slotName定制
        if (column.slotName && slots[column.slotName]) return slots[column.slotName]()
        const param = {
          class: 'form-input',
          ...i.renderArgs.param,
          ...vModelValue({
            type: column.type,
            prop: column.prop,
            prop2: column.prop2,
            single: column.single,
          }, props.model),
        }
        const formItemSlots = {
          default: () => createVNode(i.renderArgs.component, param, i.renderArgs.slots),
        }
        if (column.comment) {
          formItemSlots.label = () => {
            return (
              <div class="form-item-label">
                <div>{column.label}</div>
                <m-comment label={column.label} comment={column.comment}/>
              </div>
            )
          }
        }
        let span = column.colspan || props.colspan || colspan.value
        if (systemStore.layout.widthShrink && span < colspan.value) span = colspan.value
        if (column.cols) span = parseInt(column.cols) * span
        if (span > 24) span = 24
        return <el-col span={span}>
          <el-form-item {...i.formItemParams} v-slots={formItemSlots}/>
        </el-col>
      })
    }

    return () => {
      const formParam = {
        ref: formRef,
        disabled: props.handleType === 'detail',
        ...attrs,
        ...props,
      }
      // 明细类型需要禁用表单
      if (props.handleType === 'detail') {
        formParam.disabled = true
        // param.placeholder = ''
      }
      // 小屏设备需要强制改变布局方式
      if (systemStore.layout.widthShrink && colspan.value === 24) {
        formParam.labelPosition = 'top'
      }
      return (
        <el-form
          {...formParam} v-slots={slots}
          class={{ 'detail-form': props.handleType === 'detail' }}
        >
          <el-row>
            {generateFormColumns()}
          </el-row>
        </el-form>
      )
    }
  }
}
</script>
<style scoped lang="scss">
.form-item-label {
  display: inline-flex;
  align-items: center;
}
</style>
