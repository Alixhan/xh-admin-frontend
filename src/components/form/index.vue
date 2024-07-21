<script lang="tsx">
import { computed, createVNode, provide, ref, shallowRef, watchEffect } from 'vue'
import {
  generateDynamicColumn,
  generateFormRules,
  generateLabelWidth,
  generatePlaceholder,
  vModelValue
} from '@/components/mutils'
import { useSystemStore } from '@/stores/system'
import { useElementSize } from '@vueuse/core'
import type { UploadCtx } from '@/components/form/Upload.vue'
import { mFormEmits, mFormProps } from '@i/components/form'
import { useElComponentSizeCssVar } from '@/utils'

/**
 * 通用表单组件
 * sxh 2023-3-24
 */
export default {
  name: 'MForm',
  inheritAttrs: false,
  props: { ...mFormProps },
  emits: { ...mFormEmits },
  setup(
    props,
    {
      attrs,
      slots,
      expose
      // emit,
    }
  ) {
    const systemStore = useSystemStore()

    const formRef = ref()
    const formSize = ref(useElementSize(formRef))
    const colspan = ref(0)
    watchEffect(() => {
      let span = 24 / (Number(Math.floor(formSize.value.width / 300)) || 1)
      if (span === 4.8) span = 6
      colspan.value = span
    })

    //计算一下labelWidth，以最长label字符宽度作为form的labelWidth
    const labelWidth = computed(() => props.labelWidth ?? generateLabelWidth(...props.columns!))

    const formItemParams = shallowRef<FormColumn[]>([])
    watchEffect(initFormItemParams)

    const uploadInstances = ref<UploadCtx[]>([])

    provide('uploadInstances', uploadInstances.value)

    const elComponentSizeCssVar = useElComponentSizeCssVar()

    // 表单提交，表单验证，通过后统一上传文件
    async function submit() {
      if (props.loading) return Promise.reject('loading...')
      await formRef.value.validate()
      await Promise.all(uploadInstances.value.map((i) => i.upload()))
      return props.model
    }

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
      submit
    })

    function initFormItemParams() {
      formItemParams.value = props.columns!.map((i) => {
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
            rules: generateFormRules(i, props.model)
          },
          renderArgs: generateDynamicColumn(i)
        }
        generatePlaceholder(formItemObj.renderArgs?.param)
        return formItemObj
      })
    }

    //生成表单列
    function generateFormColumns() {
      return formItemParams.value.map((i) => {
        // 隐藏的不显示
        if (i.hidden) return null
        if (i.columnParam.type === 'separator') {
          return (
            <el-col span={24}>
              <el-divider content-position="left">
                <div class="separator">
                  <div />
                  {i.columnParam.label}
                </div>
              </el-divider>
            </el-col>
          )
        }
        const column = i.columnParam
        // 允许用户按照自己的slotName定制
        if (column.slotName) return slots[column.slotName]?.()
        const param = {
          class: 'form-input',
          ...i.renderArgs.param,
          ...vModelValue(
            {
              type: column.type,
              prop: column.prop,
              prop2: column.prop2,
              single: column.single
            },
            props.model
          )
        }
        const formItemSlots: { [name: string]: Function } = {
          default: () => {
            const vNode = createVNode(i.renderArgs.component, param, i.renderArgs.slots)
            if (i.columnParam.render) return i.columnParam.render(vNode)
            return vNode
          }
        }
        if (column.comment) {
          formItemSlots.label = () => {
            return (
              <div class="form-item-label">
                <div>{column.label}</div>
                <m-comment label={column.label} comment={column.comment} />
              </div>
            )
          }
        }
        let span = column.colspan || props.colspan || colspan.value
        if (systemStore.layout.widthShrink && span < colspan.value) span = colspan.value
        if (column.cols) span = parseInt(column.cols) * span
        if (span > 24) span = 24
        return (
          <el-col span={span}>
            <el-form-item {...i.formItemParams} v-slots={formItemSlots} />
          </el-col>
        )
      })
    }

    //生成骨架屏表单列
    function generateFormSkeletons() {
      return formItemParams.value.map((i) => {
        // 隐藏的不显示
        if (i.hidden) return null
        if (i.columnParam.type === 'separator')
          return <el-skeleton-item style={{ width: '60%', marginBottom: '1em' }} />
        const column = i.columnParam
        const formItemSlots: { [name: string]: Function } = {
          default: () => {
            const randomWidth = 30 + Math.random() * 70
            const skeletonParam = {
              variant: 'text',
              style: {
                width: `${randomWidth}%`,
                height: elComponentSizeCssVar.value,
                'align-self': 'center'
              }
            }
            if (column.type === 'switch') skeletonParam.style.width = '50px'
            if (['upload-img'].includes(column.type)) {
              skeletonParam.style.width = '150px'
              skeletonParam.style.height = '150px'
              skeletonParam.variant = 'image'
            }
            return <el-skeleton-item {...skeletonParam} />
          },
          label: () => {
            const skeletonParam = {
              variant: 'text',
              style: {
                width: `${column?.label?.length ?? 6}em`,
                maxWidth: '100%',
                height: '1em',
                'align-self': 'center'
              }
            }
            return <el-skeleton-item {...skeletonParam} />
          }
        }
        let span = column.colspan || props.colspan || colspan.value
        if (systemStore.layout.widthShrink && span < colspan.value) span = colspan.value
        if (column.cols) span = parseInt(column.cols) * span
        if (span > 24) span = 24
        return (
          <el-col span={span}>
            <el-form-item {...{ ...i.formItemParams, required: false }} v-slots={formItemSlots} />
          </el-col>
        )
      })
    }

    return () => {
      const isDetail = props.handleType === 'detail'
      const formParam: any = {
        ref: formRef,
        ...attrs,
        ...props,
        labelWidth: labelWidth.value
      }
      // 明细类型需要禁用表单
      if (isDetail) {
        formParam.disabled = true
      }
      // 小屏设备需要强制改变布局方式（竖屏）
      if (systemStore.layout.widthShrink && colspan.value === 24) {
        formParam.labelPosition = 'top'
      }
      const skeletonParam = {
        loading: props.loading ?? false,
        animated: true
      }

      const skeletonSlots = {
        default: () => <el-row>{generateFormColumns()}</el-row>,
        template: () => <el-row>{generateFormSkeletons()}</el-row>
      }
      return (
        <el-form {...formParam} v-slots={slots} class={{ 'detail-form': props.handleType === 'detail' }}>
          <el-skeleton {...skeletonParam} v-slots={skeletonSlots} />
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

.separator {
  font-size: 14px;
  color: var(--el-text-color);
  display: flex;
  align-items: center;

  > div {
    width: 6px;
    height: 15px;
    background-color: var(--el-color-primary);
    margin-right: 10px;
  }
}
</style>
