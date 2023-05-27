<template>
  <div class="root">
    <el-scrollbar class="left-tree-view">
      <div class="tree-filter-view">
        <el-input v-model="dictTypeQueryParam.param.name" placeholder="字典类型名称" clearable />
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
      is-filter-table
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryDictDetailList"
      v-model:data="data"
    >
      <template #left-action>
        <!--        <el-button type="success" @click="toggleExpand"> 全部 展开/收起</el-button>-->
      </template>
      <template #right-action>
        <el-button
          type="primary"
          icon="plus"
          @click="openForm('add')"
          >新增
        </el-button>
      </template>
    </m-table>
    <el-dialog
      :title="formTitle[handleType]"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="600"
    >
      <dict-form :handle-type="handleType" :model-value="row" style="height: 50vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { reactive, ref, shallowRef } from 'vue'
import { queryDictDetailList, queryDictTypeList } from '@/api/system/dict'
import { sfList } from '@/views/system/menu/constant'
import DictForm from './dictForm.vue'
import { auth } from '@/directive'
import { join } from '@/utils/arrays'

const formTitle = {
  copy: '数据字典复制',
  add: '数据字典新增',
  edit: '数据字典编辑',
  detail: '数据字典明细'
}

const dictTypeData = ref([])
const dictTypeQueryParam = ref({
  isPage: false,
  param: {
    name: ''
  }
})
queryDictType()

function queryDictType () {
  queryDictTypeList(dictTypeQueryParam.value).then((res) => {
    dictTypeData.value = [{ id: 0, name: '全部字典', children: res.data.list }]
    console.info(res)
  })
}

const tableRef = ref()
const defaultProps = {
  children: 'children',
  label: 'name'
}

const data = ref([])

const filterParam = reactive({})

const topFilterColumns = shallowRef([
  { prop: 'dictTypeId', label: '字典类型ID', hidden: true },
  { prop: 'dictTypeName', label: '字典类型', readonly: true },
  { prop: 'value', label: '字典值key' },
  { prop: 'label', label: '字典名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: sfList }
])

const columns = ref([
  { type: 'index', label: '序', width: 50 },
  { prop: 'id', label: 'ID', width: 50 },
  { prop: 'dictTypeName', label: '字典类型' },
  { prop: 'parentId', label: '上级id' },
  { prop: 'value', label: '字典key' },
  { prop: 'label', label: '字典名称' },
  {
    prop: 'order',
    label: '排序号',
    width: 85,
    comment: '数据字典的排列顺序，小号排在前，大号排在后。'
  },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: sfList },
  { prop: 'createTime', label: '创建时间', type: 'datetime', width: 155 },
  { prop: 'updateTime', label: '修改时间', type: 'datetime', width: 155 }
])

const addAuth = auth('add')
const editAuth = auth('edit')
const detailAuth = auth('detail')
// 添加操作栏
if (addAuth || editAuth || detailAuth) {
  let width = 44 * ((addAuth ? 1 : 0) + (editAuth ? 1 : 0) + (detailAuth ? 1 : 0))
  if (width < 50) width = 50
  columns.value.unshift({
    label: '操作',
    fixed: 'right',
    width,
    notExport: true,
    slots: {
      default (scope) {
        const arr = []
        if (addAuth) {
          arr.push(
            <el-link type="primary" underline={false} onClick={() => openForm('copy', scope.row)}>
              复制
            </el-link>
          )
        }
        if (editAuth) {
          arr.push(
            <el-link type="primary" underline={false} onClick={() => openForm('edit', scope.row)}>
              编辑
            </el-link>
          )
        }
        if (detailAuth) {
          arr.push(
            <el-link type="primary" underline={false} onClick={() => openForm('detail', scope.row)}>
              明细
            </el-link>
          )
        }
        // 添加分隔符
        return join(arr, <el-divider direction="vertical" />)
      }
    }
  })
}

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function handleNodeClick (node) {
  filterParam.dictTypeId = node.id
  filterParam.dictTypeName = node.name
  if (node.id === 0) {
    filterParam.dictTypeId = ''
    filterParam.dictTypeName = ''
  }
  tableRef.value.fetchQuery()
}

function openForm (type, r) {
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

function close (type) {
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
    flex-wrap: wrap;

    .left-tree-view {
      width: 100%;
      max-height: 200px;
    }
  }
}
</style>
