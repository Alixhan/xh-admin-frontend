<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form ref="formRef" :loading="formLoading" :columns="columns" :model="formData" :handle-type="handleType">
        <template #design>
          <design-column
            ref="columnRef"
            class="table-column-view"
            v-model="formData.columns"
            :handle-type="handleType"
            :design-type="formData.designType"
          />
        </template>
      </m-form>
    </el-scrollbar>
    <div class="m-footer">
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType ?? '')"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
          >{{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { computed, type PropType, ref, toRef } from 'vue'
import { getBackendPath, getGeneratorById, getTableDetail, getTableList, postSaveGenerator } from '@/api/generator'
import { useI18n } from 'vue-i18n'
import type { CommonFormColumn } from '@i/components/form'
import DesignColumn from '@/views/generator/designColumn.vue'
import { camelCase, upperFirst } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { designTypeItems, preselectionColumns } from '@/views/generator/constant'

defineOptions({
  name: 'CodeGenForm'
})

const emits = defineEmits(['close'])

const props = defineProps({
  modelValue: Object,
  handleType: String as PropType<FormHandleType>
})

const handleType = ref(toRef(props, 'handleType').value)

const { t } = useI18n()

const formData = ref({
  designType: '',
  id: null,
  tableName: '',
  tableComment: '',
  entityName: '',
  name: '',
  service: '',
  module: '',
  author: '',
  extend: 'BaseEntity',
  frontendPath: '',
  backendPath: '',
  isCreateMenu: false,
  isDataPermission: false,
  columns: []
})

const tables = getTableList().then((res) => res.data)

const columns = computed(() => {
  const cols: CommonFormColumn<typeof formData.value>[] = [
    {
      prop: 'designType',
      label: '设计方式',
      type: 'select',
      itemList: designTypeItems,
      rules: [{ required: true }],
      onChange() {
        formData.value.tableName = ''
      }
    }
  ]
  if (formData.value.designType) {
    cols.push(
      ...([
        {
          prop: 'tableName',
          label: '表名',
          onChange: changeTableName,
          rules: [{ required: true, pattern: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/ }],
          ...(formData.value.designType === '2'
            ? {
                type: 'select',
                itemList: tables,
                labelKey: 'tableName',
                valueKey: 'tableName',
                filterable: true
              }
            : {})
        },
        {
          prop: 'tableComment',
          label: '表注释',
          onChange: changeTableComment,
          rules: [{ required: true }]
        },
        { prop: 'entityName', label: '实体类名', rules: [{ required: true, pattern: /^[A-Z][A-Za-z0-9]*$/ }] },
        { prop: 'name', label: '功能名', rules: [{ required: true }] },
        {
          prop: 'service',
          label: '所属服务',
          type: 'select',
          comment: '必选！指定代码所属的微服务。',
          itemList: [{ value: 'system', label: 'system 系统服务' }],
          rules: [{ required: true, pattern: /^[a-z][a-z0-9]*$/ }]
        },
        {
          prop: 'module',
          label: '模块',
          comment: '主要考虑业务代码分包好管理，不填则表示不分模块，多层级模块请用 / 分隔，例：member/score。',
          rules: [{ pattern: /^[a-z][a-z0-9]*(\/[a-z][a-z0-9]*)*$/ }]
        },
        { prop: 'author', label: '作者', rules: [{ required: true }] },
        {
          prop: 'extend',
          label: '继承类',
          comment: '继承通用类，可以获得通用字段，比如创建时间，主键等',
          type: 'select',
          labelKey: 'value',
          itemList: [{ value: 'BaseEntity' }, { value: 'DataPermissionEntity' }],
          onChange(val: string) {
            if (val !== 'DataPermissionEntity') formData.value.isDataPermission = false
          }
        },
        {
          prop: 'frontendPath',
          label: '前端路径',
          cols: 2,
          comment:
            'web前端项目的绝对路径，代码将生成至此目录，可自动识别当前项目路径，若识别错误或需变更目录请手动调整。',
          rules: [{ required: true }],
          slots: {
            append: () => <el-button onClick={autoGetFrontendPath}>自动获取</el-button>
          }
        },
        {
          prop: 'backendPath',
          label: '后端路径',
          cols: 2,
          comment:
            'java后端的项目的绝对路径，代码将生成至此目录，可自动识别当前项目路径，若识别错误或需变更目录请手动调整。',
          rules: [{ required: true }],
          slots: {
            append: () => <el-button onClick={autoGetBackendPath}>自动获取</el-button>
          }
        },
        {
          prop: 'isCreateMenu',
          label: '创建系统菜单',
          type: 'switch',
          comment: '自动创建系统菜单及按钮'
        },
        {
          prop: 'isDataPermission',
          disabled: formData.value.extend !== 'DataPermissionEntity',
          label: '启用数据权限',
          type: 'switch',
          comment: '须继承DataPermissionEntity实体类后可选，选中后将自动创建数据实体，列表查询自动启用数据权限。'
        },
        { type: 'separator', label: '字段配置' },
        { slotName: 'design' }
      ] as CommonFormColumn<typeof formData.value>[])
    )
  }
  return cols
})

const formLoading = ref(true)
const saveLoading = ref(false)
const formRef = ref()
const columnRef = ref()

init()

async function init() {
  formLoading.value = true
  await initFormData()
  formLoading.value = false
}

async function initFormData() {
  if (handleType.value !== 'add') {
    // 查询明细
    await getGeneratorById(props.modelValue?.id).then((res) => {
      formData.value = res.data
    })
  }
}

function changeTableName(val: string) {
  formData.value.entityName = upperFirst(camelCase(val))
  if (formData.value.designType === '2') {
    if (val) {
      getTableDetail({ tableName: val }, { showLoading: true }).then((res) => {
        const data = res.data
        formData.value.entityName = upperFirst(camelCase(val))
        formData.value.tableComment = data.remarks
        changeTableComment(formData.value.tableComment)
        formData.value.columns = data.columns.map((col: any) => {
          const preColumn = preselectionColumns.find((i) => i.colType === col.typeName)
          const column: any = Object.assign(
            {
              formType: 'text',
              colType: 'VARCHAR',
              javaType: 'String',
              isTable: true,
              isQuery: true,
              isForm: true,
              isImport: true,
              isExport: true
            },
            preColumn ?? {},
            {
              columnName: col.columnName,
              remarks: col.remarks,
              colType: col.typeName,
              tableName: col.tableName,
              prop: camelCase(col.columnName),
              label: col.remarks,
              primaryKey: col.primaryKey,
              primaryKeyType: col.isAutoincrement ? 'auto' : '',
              columnSize: col.columnSize,
              decimalDigits: col.decimalDigits
            }
          )
          return column
        })
      })
    }
  }
}

function changeTableComment(val: string) {
  if (val) val = val.replace(/表$/, '')
  formData.value.name = val + '管理'
}

async function save() {
  console.info(formData.value)
  await formRef.value.submit()
  await columnRef.value.validColumn()
  postSaveGenerator(formData.value, {
    loadingRef: saveLoading,
    showSuccessMsg: true,
    successMsg: t('common.saveSuccess')
  }).then(() => {
    emits('close', 'refresh')
  })
}

function autoGetFrontendPath() {
  if (import.meta.env.DEV) {
    formData.value.frontendPath = import.meta.env.VITE_FRONTEND_PATH
  } else {
    ElMessage.warning('仅开发环境可获取')
  }
}

async function autoGetBackendPath() {
  if (import.meta.env.DEV) {
    formData.value.backendPath = await getBackendPath().then((res) => res.data)
  } else {
    ElMessage.warning('仅开发环境可获取')
  }
}
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

    .table-column-view {
      width: 100%;
    }
  }
}

.m-footer {
  text-align: left;
}
</style>
