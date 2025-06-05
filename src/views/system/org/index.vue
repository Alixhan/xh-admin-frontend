<template>
  <div class="root">
    <el-scrollbar class="left-tree-view">
      <div class="tree-filter-view">
        <el-input v-model="orgQueryParam.name" :placeholder="$t('system.org.name')" clearable />
        <el-button style="margin-left: 10px" icon="refresh" type="primary" @click="getOrgTree" />
      </div>
      <el-tree
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :data="orgData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      />
    </el-scrollbar>
    <m-table
      class="m-table"
      ref="tableRef"
      :layout="systemStore.layout.widthShrink ? 'auto' : undefined"
      is-filter-table
      is-complex-filter
      row-key="id"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryOrgList"
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #right-action>
        <el-button v-auth="'system:org:add'" type="primary" icon="plus" @click="openForm('add')"
          >{{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:org:del'"
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
      :title="handleType && $t('system.org.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="600"
    >
      <org-form :handle-type="handleType" :model-value="row" style="height: 50vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delOrgByIds, queryOrgList, queryOrgTree } from '@/api/system/org'
import OrgForm from './orgForm.vue'
import getDictDetails from '@/utils/dict'
import { useSystemStore } from '@/stores/system'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const systemStore = useSystemStore()
const orgData = ref([])
const orgQueryParam = ref({
  name: ''
})
getOrgTree()

function getOrgTree() {
  queryOrgTree(orgQueryParam.value).then((res) => {
    const list = res.data.list
    const obj = {}
    list.forEach((i) => {
      i.children = []
      obj[i.id] = i
    })
    const data = list.filter((i) => {
      const parent = obj[i.parentId]
      if (parent) {
        parent.children.push(i)
        return false
      }
      // parentId不存在的为根元素
      return true
    })
    orgData.value = [{ id: 0, name: t('system.org.all'), children: data }]
  })
}

const tableRef = ref()
const defaultProps = {
  children: 'children',
  label: 'name'
}

const data = ref([])
const selectRows = ref([])
const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'code', label: t('system.org.code') },
  { prop: 'name', label: t('system.org.name') },
  { prop: 'parentId', label: t('system.org.parentId') },
  { prop: 'parentName', label: t('system.org.parentName') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

const columns = computed(() => [
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'system:org:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:org:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        icon: 'delete',
        auth: 'system:org:del',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  },
  { type: 'index', width: 90 },
  { prop: 'id', label: 'Id' },
  { prop: 'code', label: t('system.org.code') },
  { prop: 'name', label: t('system.org.name') },
  { prop: 'parentId', label: t('system.org.parentId') },
  { prop: 'parentName', label: t('system.org.parentName') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', width: 155 },
  { prop: 'updateTime', label: t('common.updateTime'), type: 'datetime', width: 155 }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()
const currentNode = ref()

function handleNodeClick(node) {
  filterParam.parentId = node.id
  filterParam.parentName = node.name
  currentNode.value = {
    parentId: node.id,
    parentName: node.name
  }
  if (node.id === 0) {
    filterParam.parentId = ''
    filterParam.parentName = ''
    currentNode.value = {}
  }
  tableRef.value.fetchQuery()
}

function openForm(type, r) {
  row.value = r
  if (type === 'add') {
    row.value = {
      parentId: currentNode.value?.parentId,
      parentName: currentNode.value?.parentName
    }
  }
  formVisible.value = true
  handleType.value = type
}

function del(rows) {
  delOrgByIds(rows.map((i) => i.id).join(','), {
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
