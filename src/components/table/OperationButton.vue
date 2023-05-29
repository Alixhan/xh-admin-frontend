<script lang="tsx">
import type { PropType } from 'vue'
import { createVNode, defineComponent, ref, watchEffect } from 'vue'
import { auth } from '@/directive/index.js'
import { join } from '@/utils/arrays.js'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElLink } from 'element-plus'

/**
 * 操作按钮，主要简化表格按钮的控制，超出的按钮归纳在更多的下拉菜单里
 * sxh
 * 2023-5-27
 */
export interface OperationButton {
  type?: '' | 'default' | 'success' | 'warning' | 'info' | 'text' | 'primary' | 'danger'
  label: string
  icon?: string
  auth?: string | string[]
  authLogic?: 'and' | 'or'
  authFull?: boolean
  onClick?: (row: any) => void
  disabled?: boolean | ((row: any) => boolean)
}
export default defineComponent({
  inheritAttrs: false,
  name: 'MOperationButton',
  props: {
    row: Object,
    maxCount: {
      type: Number,
      default: 2
    },
    buttons: {
      type: Array as PropType<Array<OperationButton>>,
      required: true
    }
  },
  setup(props) {
    // 需要收纳
    const storage = ref(false)
    const arr1 = ref<Array<OperationButton>>([])
    const arr2 = ref<Array<OperationButton>>([])
    watchEffect(() => {
      const buttons: Array<OperationButton> = props.buttons.filter((i) => {
        if (!i.auth) return true
        return auth(i.auth, i.authLogic, i.authFull)
      })
      arr1.value = buttons
      if (buttons.length > props.maxCount) {
        storage.value = true
        arr1.value = buttons.splice(0, ~~(props.maxCount - 1))
        arr2.value = buttons
      } else {
        storage.value = false
      }
    })
    return () => {
      const btnArr: any[] = []
      btnArr.push(
        ...arr1.value.map((i) =>
          createVNode(
            ElLink,
            {
              underline: false,
              type: 'primary',
              ...i,
              onClick: () => i.onClick?.(props.row),
              disabled: i.disabled instanceof Function ? i.disabled(props.row) : i.disabled
            },
            () => i.label
          )
        )
      )
      if (storage.value) {
        btnArr.push(
          createVNode(
            ElDropdown,
            {},
            {
              default: () =>
                createVNode(ElLink, { underline: false, type: 'primary' }, () => {
                  return (
                    <span>
                      更多
                      <el-icon>
                        <arrow-down />
                      </el-icon>
                    </span>
                  )
                }),
              dropdown: () =>
                createVNode(ElDropdownMenu, {}, () =>
                  arr2.value.map((i) =>
                    createVNode(
                      ElDropdownItem,
                      {
                        style: `color: var(--el-color-${i.type ?? 'primary'});`,
                        ...i,
                        onClick: () => i.onClick?.(props.row),
                        disabled:
                          i.disabled instanceof Function ? i.disabled(props.row) : i.disabled
                      },
                      () => i.label
                    )
                  )
                )
            }
          )
        )
      }
      return <div class="operation-button">{join(btnArr, <el-divider direction="vertical" />)}</div>
    }
  }
})
</script>
<style scoped lang="scss">
.operation-button {
  width: auto;
  display: inline-flex;
  align-items: center;
}
</style>
