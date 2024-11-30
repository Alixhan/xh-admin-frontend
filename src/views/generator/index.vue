<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryGeneratorList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'system:user:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:user:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >{{ $t('common.del') }}
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('generator.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      fullscreen
      :close-on-click-modal="false"
    >
      <code-gen-form :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
  </div>
</template>
<script setup lang="tsx">
import type { Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import { delGeneratorByIds, getCodeZipFile, postGenerateCode, queryGeneratorList } from '@/api/generator'
import CodeGenForm from './codeGenForm.vue'
import { useI18n } from 'vue-i18n'
import FileSaver from 'file-saver'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'tableName', label: '表名' },
  { prop: 'name', label: '功能名' },
  { prop: 'author', label: '作者' }
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'tableName', label: '表名' },
  { prop: 'entityName', label: '实体名' },
  { prop: 'tableComment', label: '表注释' },
  { prop: 'name', label: '功能名' },
  { prop: 'service', label: '所属服务' },
  { prop: 'module', label: '模块名' },
  { prop: 'author', label: '作者' },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'system:user:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        auth: 'system:user:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), auth: 'system:user:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) },
      { label: t('generator.download'), icon: 'download', type: 'primary', onClick: downloadCodeZipFile },
      {
        label: t('generator.label'),
        icon: 'local|/src/assets/icon/generator.svg',
        type: 'primary',
        onClick: generateCode
      }
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows: any[]) {
  delGeneratorByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: t('common.confirmDelete')
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

function close(type) {
  formVisible.value = false
  if (type === 'refresh') {
    tableRef.value.fetchQuery()
  }
}

function downloadCodeZipFile(row) {
  getCodeZipFile(row.id, {
    showLoading: true,
    showSuccessMsg: true,
    successMsg: '下载成功'
  }).then((res) => {
    FileSaver.saveAs(res as any, `${row.name}.zip`)
  })
}

function generateCode(row) {
  postGenerateCode(row.id, {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    successMsg: '代码生成成功！',
    confirmMsg: '确认生成代码吗？'
  })
}
</script>
<style lang="scss" scoped></style>
