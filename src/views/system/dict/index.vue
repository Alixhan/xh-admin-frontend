<template>
  <div class="root">
    <el-scrollbar class="left-tree-view">
      <div class="tree-filter-view">
        <el-input v-model="dictTypeQueryParam.param.name" :placeholder="$t('system.dict.dictTypeName')" clearable />
        <el-button style="margin-left: 10px" icon="refresh" type="primary" @click="queryDictType" />
      </div>
      <el-tree
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :data="dictTypeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </el-scrollbar>
    <m-table
      class="m-table"
      ref="tableRef"
      :layout="systemStore.layout.widthShrink ? 'auto' : undefined"
      is-filter-table
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryDictDetailList"
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      is-complex-filter
    >
      <template #right-action>
        <el-button v-auth="'system:dict:add'" type="primary" icon="plus" @click="openForm('add')"
          >{{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:dict:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
        >
          {{ $t('common.del') }}
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('system.dict.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
      width="600"
    >
      <dict-form :handle-type="handleType" :model-value="row" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delDictDetailByIds, queryDictDetailList, queryDictTypeList } from '@/api/system/dict'
import DictForm from './dictForm.vue'
import getDictDetails from '@/utils/dict'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const systemStore = useSystemStore()

const dictTypeData = ref([])
const dictTypeQueryParam = ref({
  isPage: false,
  param: {
    name: ''
  }
})
queryDictType()

function queryDictType() {
  queryDictTypeList(dictTypeQueryParam.value).then((res) => {
    dictTypeData.value = [
      {
        id: 0,
        title: t('system.dict.all'),
        children: res.data.list.map((i) => {
          return {
            ...i,
            title: `${i.name}  -  ${i.id}`
          }
        })
      }
    ]
  })
}

const tableRef = ref()
const defaultProps = {
  children: 'children',
  label: 'title'
}

const data = ref([])
const selectRows = ref([])
const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'dictTypeId', label: t('system.dict.dictTypeId'), hidden: true },
  { prop: 'dictTypeName', label: t('system.dict.dictTypeName'), readonly: true },
  { prop: 'value', label: t('system.dict.value') },
  { prop: 'label', label: t('system.dict.labelName') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

const columns = computed(() => [
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), icon: 'edit', auth: 'system:dict:edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:dict:detail',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), icon: 'delete', auth: 'system:dict:del', type: 'danger', onClick: (row) => del([row]) }
    ]
  },
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'dictTypeName', label: t('system.dict.dictTypeName') },
  { prop: 'parentId', label: t('system.dict.parent') },
  { prop: 'value', label: t('system.dict.value') },
  { prop: 'label', label: t('system.dict.labelName') },
  { prop: 'order', label: t('common.order'), comment: t('system.dict.orderComment') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  { prop: 'updateTime', label: t('common.updateTime'), type: 'datetime', width: 155 }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function handleNodeClick(node) {
  filterParam.dictTypeId = node.id
  filterParam.dictTypeName = node.name
  if (node.id === 0) {
    filterParam.dictTypeId = ''
    filterParam.dictTypeName = ''
  }
  tableRef.value.fetchQuery()
}

function openForm(type, r) {
  row.value = r
  if (type === 'add') {
    row.value = {
      dictTypeId: filterParam.dictTypeId,
      dictTypeName: filterParam.dictTypeName
    }
  }
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delDictDetailByIds(rows.map((i) => i.id).join(','), {
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
</script>
<style lang="scss" scoped>
.root {
  display: flex;
  align-items: stretch;
  gap: 10px;

  .left-tree-view {
    height: auto;
    padding: 15px;
    width: 200px;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-bg-color);

    .tree-filter-view {
      display: flex;
      margin-bottom: 10px;
    }
  }

  .m-table {
    width: 0;
    flex-grow: 1;
  }
}

.width-shrink-layout {
  .root {
    height: auto;
    flex-wrap: wrap;

    .left-tree-view {
      width: 100%;
    }

    :deep(.el-table__inner-wrapper) {
      .el-table__body-wrapper {
        .el-scrollbar__wrap {
          overflow-y: hidden;
        }

        .el-scrollbar__bar {
          &.is-vertical {
            display: none;
          }
        }
      }
    }
  }
}
</style>
