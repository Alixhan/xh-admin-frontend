<script lang="tsx">
import { createVNode, provide, ref, shallowRef, type SlotsType, watchEffect } from 'vue'
import { generateDynamicColumn, generateFormRules, generatePlaceholder, vModelValue } from '@/components/mutils'
import { useSystemStore } from '@/stores/system'
import { useElementSize } from '@vueuse/core'
import type { UploadCtx } from '@/components/form/Upload.vue'
import { type CommonFormColumn, mFormEmits, mFormProps } from '@i/components/form'
import { useElComponentSizeCssVar } from '@/utils'
import type { SlotsObj } from '@i/components'

/**
 * 通用表单组件
 * sxh 2023-3-24
 */
export default {
  name: 'MForm',
  inheritAttrs: false,
  props: { ...mFormProps },
  emits: { ...mFormEmits },
  slots: Object as SlotsType<{
    default: void
    'top-btn': boolean
    [slot: string]: any
  }>,
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
    const cols = ref(0)
    watchEffect(() => {
      let sizeWidth = 300
      if (props.labelPosition === 'top') sizeWidth -= 60
      if (systemStore.layout.size === 'small') sizeWidth -= 50
      cols.value = Number(Math.floor(formSize.value.width / sizeWidth)) || 1
    })

    const formItemParams = shallowRef<CommonFormColumn<any>[]>([])
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
      clearValidate: function (...args) {
        return formRef.value.clearValidate(...args)
      },
      scrollToField: function (...args) {
        return formRef.value.scrollToField(...args)
      },
      resetFields: function (...args) {
        return formRef.value.resetFields(...args)
      },
      validateField: function (...args) {
        return formRef.value.validateField(...args)
      },
      validate: function (...args) {
        return formRef.value.validate(...args)
      },
      submit
    })

    function initFormItemParams() {
      formItemParams.value = props.columns!.map((i) => {
        // 隐藏的直接返回
        if (i.hidden) return i
        const formItemObj: CommonFormColumn<any> = {
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

    function getColSpan(column: CommonFormColumn<any>) {
      const colspan = 24 / cols.value
      let span = column.colspan || props.colspan || colspan
      if (span < colspan) span = colspan
      if (!column.colspan && column.cols) span = Number(column.cols) * span
      // 保证均匀的跨列
      span = [2, 3, 4, 6, 8, 12, 16, 18, 20, 24].find((i) => i >= span) ?? 24
      return span
    }

    //生成表单列
    function generateFormColumns() {
      let topBtnIndex = -1
      let spans = 0
      const columnViews = formItemParams.value.map((i, index) => {
        // 隐藏的不显示
        if (i.hidden) return null
        if (i.columnParam.type === 'separator') {
          let content = i.columnParam.label && <div>{i.columnParam.label}</div>
          if (i.columnParam.render) content = i.columnParam.render()
          return (
            <el-col span={24} class="separator">
              {content}
            </el-col>
          )
        }
        const column = i.columnParam
        const span = getColSpan(column)
        if (topBtnIndex === -1) {
          const sp = spans + span
          if (sp >= 24) topBtnIndex = index
          else spans = sp
        }
        i.$span = span
        // 允许用户按照自己的slotName定制
        if (column.slotName) return slots[column.slotName]?.(i)
        const param = {
          class: 'form-input',
          ...i.renderArgs?.param,
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
        const formItemSlots: SlotsObj = {
          default: () => {
            const vNode = i.renderArgs && createVNode(i.renderArgs.component, param, i.renderArgs.slots)
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
        return (
          <el-col span={span}>
            <el-form-item {...i.formItemParams} v-slots={formItemSlots} />
          </el-col>
        )
      })
      if (slots['top-btn']) {
        const btnView = (
          <el-col span={spans < 24 ? 24 - spans : getColSpan({})}>
            <el-form-item label-width="0">{slots['top-btn'](topBtnIndex !== -1)}</el-form-item>
          </el-col>
        )
        if (topBtnIndex === -1) {
          columnViews.push(btnView)
        } else {
          columnViews.splice(topBtnIndex, 0, btnView)
        }
      }
      return columnViews
    }

    //生成骨架屏表单列
    function generateFormSkeletons() {
      return formItemParams.value.map((i) => {
        // 隐藏的不显示
        if (i.hidden) return null
        if (i.columnParam.type === 'separator')
          return <el-skeleton-item style={{ width: '100%', marginBottom: '1em' }} />
        const column = i.columnParam
        const formItemSlots: SlotsObj = {
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
        return (
          <el-col span={getColSpan(column)}>
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
        ...props
      }
      // 明细类型需要禁用表单
      if (isDetail) {
        formParam.disabled = true
      }
      // 小屏设备需要强制改变布局方式（竖屏）
      if (!props.labelPosition && systemStore.layout.widthShrink && cols.value === 1) {
        formParam.labelPosition = 'top'
      }
      formParam.labelWidth ??= 'auto'
      formParam.labelPosition ??= 'right'
      const skeletonParam = {
        loading: props.loading ?? false,
        animated: true
      }
      const skeletonSlots = {
        default: () => <el-row>{generateFormColumns()}</el-row>,
        template: () => <el-row>{generateFormSkeletons()}</el-row>
      }
      const formSlots = {
        ...slots,
        default: () => [<el-skeleton {...skeletonParam} v-slots={skeletonSlots} />, slots.default?.()]
      }
      return <el-form {...formParam} v-slots={formSlots} class={{ 'detail-form': props.handleType === 'detail' }} />
    }
  }
}
</script>
<style scoped lang="scss">
.form-item-label {
  display: inline-flex;
  align-items: center;
}

.el-col {
  padding: 0 5px;
}

.separator {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--el-text-color-regular);
  margin: 0.5em 0;
  border-bottom: var(--el-border);

  > div {
    margin-bottom: 0.5em;
  }
}
</style>
