<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
        label-position="top"
      >
        <template #expression="{ formItemParams }">
          <el-col :span="24">
            <el-form-item :label="$t('system.dataPermission.expression')" v-bind="formItemParams">
              <div>
                <div class="preview">
                  <div v-html="previews" />
                  <div v-html="expressionStr" />
                </div>
                <div class="opt-btn" v-if="handleType !== 'detail'">
                  <el-icon @click="addRow()" size="16" color="var(--el-color-primary)" style="cursor: pointer">
                    <CirclePlus />
                  </el-icon>
                </div>
                <template v-if="handleType !== 'detail'">
                  <permission-row
                    v-for="(filter, index) in expression"
                    :key="index"
                    :index="index"
                    :model-value="filter"
                    :handle-type="handleType"
                    @remove="removeRow(index)"
                  />
                </template>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['system:dataPermission:add', 'system:dataPermission:edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { computed, type PropType, provide, ref, toRef, watch, watchEffect } from 'vue'
import { getDataPermissionById, postSaveDataPermission } from '@/api/system/dataPermission'
import { useI18n } from 'vue-i18n'
import PermissionRow from './PermissionRow.vue'
import MForm from '@/components/form/index.vue'

export interface PermissionRowType {
  logic: 'and' | 'or'
  condition?: 'positive' | 'negative'
  prop: string
  value: any
  children?: PermissionRowType[]
}

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {
    type: Object as PropType<{
      id?: number
      [prop: string]: any
    }>
  }
})
const emit = defineEmits(['close'])

const { t } = useI18n()

//查询数据加载状态
const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref<{ [prop: string]: any }>({
  expression: '',
  json: ''
})
const handleType = toRef(props, 'handleType')

initFormData()

//初始化form数据
async function initFormData() {
  formLoading.value = true
  if (handleType.value !== 'add') {
    // 查询明细
    await getDataPermissionById(props.modelValue!.id!).then((res) => {
      formData.value = res.data
      expression.value = JSON.parse(formData.value.json)
    })
  }
  formLoading.value = false
}

// 表单字段根据表单数据变化，有所不同
const columns = ref<CommonFormColumn[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'name', label: t('system.dataPermission.name'), rules: { required: true } },
    {
      prop: 'expression',
      slotName: 'expression',
      label: t('system.dataPermission.expression')
    }
  ]
})

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    const option: RequestOption = {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }
    if (!formData.value.expression) {
      option.showBeforeConfirm = true
      option.confirmMsg = '权限表达式为空表示具有查看所有数据的权限，这会导致设置此数据权限的角色权限过大，可能会造成数据泄露，确定保存吗？'
    }
    postSaveDataPermission(formData.value, option).then(() => close('refresh'))
  })
}

function close(type?: any) {
  emit('close', type)
}

const expression = ref<any[]>([])

function addRow(parent?: PermissionRowType) {
  const permissionRow: PermissionRowType = {
    prop: '$BR',
    logic: 'and',
    condition: 'positive',
    value: '',
    children: undefined
  }
  if (parent) {
    parent.children ??= []
    if (parent.children.length === 0) {
      parent.children.push({ ...parent, children: undefined })
    }
    parent.children.push(permissionRow)
  } else {
    expression.value.push(permissionRow)
  }
}

function removeRow(index: number, parent?: PermissionRowType) {
  if (parent) {
    parent.children!.splice(index, 1)
    if (parent.children!.length === 1) {
      Object.assign(parent, parent.children![0])
    }
  } else {
    expression.value.splice(index, 1)
  }
}

const permissionColumns = [
  { prop: '$BR', label: '本人' },
  { prop: '$BJG', label: '本机构' },
  { prop: '$BJGX', label: '本机构的下属机构' },
  { prop: '$DQJS', label: '当前角色' },
  { prop: '$DQJSX', label: '当前角色的下属角色' },
  { prop: '$ZDJG', label: '指定机构' },
  { prop: '$ZDJS', label: '指定角色' },
  { prop: '$ZDYH', label: '指定用户' }
]

function getPreview(filter: PermissionRowType, index: number) {
  const p = {
    ...filter,
    str: '',
    expression: '',
    children: undefined
  }
  const column = permissionColumns?.find((i) => i.prop === filter.prop)
  let str = ''
  let expression = ''
  if (index !== 0) {
    str += `<span class="logic"> ${t('m.table.' + filter.logic)} </span> `
    expression += `${filter.logic} `
  }
  if (filter.children?.length) {
    const childrenPreviews = filter.children.map((i, j) => getPreview(i, j))
    str += ` ( ${childrenPreviews.map((i) => i.str).join('')} ) `
    expression += `( ${childrenPreviews.map((i) => i.expression).join(' ')} )`
    p.children = childrenPreviews as any
  } else {
    if (filter.condition === 'negative') {
      str += `<span class="condition"> ${t('system.dataPermission.' + filter.condition)}</span>`
    }
    str += `<span class="field">${column?.label}</span>`
    expression += `${filter.condition === 'negative' ? '^' : ''}${column?.prop}`
    if (filter.value) {
      str += `(${filter.value}) `
      expression += `(${filter.value})`
    }
  }
  p.str = str
  p.expression = expression
  return p
}

const previews = computed(() =>
  expression.value
    .map(getPreview)
    .map((i) => i.str)
    .join('')
)
const expressionStr = computed(() =>
  expression.value
    .map(getPreview)
    .map((i) => i.expression)
    .join(' ')
)

watch(
  () => expressionStr.value,
  () => {
    formData.value.expression = expressionStr.value
    formData.value.json = JSON.stringify(expression.value)
  }
)

const permissionHome = {
  addRow,
  removeRow,
  columns: permissionColumns
}

export declare type PermissionHome = typeof permissionHome

provide<PermissionHome>('permissionHome', permissionHome)
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;

    .preview {
      width: 100%;

      :deep(.valid) {
        text-decoration: line-through;
        opacity: 0.5;

        .valid {
          opacity: 1;
        }
      }

      :deep(.logic) {
        color: var(--el-color-danger);
        font-weight: bold;
      }

      :deep(.field) {
        color: var(--el-color-primary);
      }

      :deep(.condition) {
        color: var(--el-color-success);
      }

      :deep(.value) {
        color: var(--el-text-color);
      }
    }
  }
}
</style>
