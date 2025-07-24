<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      row-key="id"
      :is-page="false"
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="fetchMenus"
      v-model:data="data"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
    >
      <template #left-action>
        <el-button type="success" @click="toggleExpand">
          {{ $t('common.expand') }}/{{ $t('common.collapse') }} {{ $t('common.all') }}
        </el-button>
      </template>
      <template #right-action>
        <el-button v-auth="'system:menu:add'" type="primary" icon="plus" @click="openForm('add')"
          >{{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'system:menu:del'"
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
      :title="handleType && $t('system.menu.' + handleType)"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      width="800px"
      append-to-body
    >
      <menu-form :handle-type="handleType" :model-value="row" style="height: 75vh" @close="close" />
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { delMenuByIds, postSwitchMenuProp, queryMenuList } from '@/api/system/menu'
import { generateTreeMenu, menuTypeList } from '@/views/system/menu/constant'
import MenuForm from './menuForm.vue'
import getDictDetails from '@/utils/dict'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'title', label: t('system.menu.title') },
  { prop: 'enabled', label: t('common.isEnabled'), type: 'select', itemList: getDictDetails(1, 'boolean') }
])

const columns = computed(() => [
  { prop: 'title', label: t('system.menu.title'), fixed: false, minWidth: 200 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'platform', label: t('system.menu.platform') },
  { prop: 'name', label: 'Name' },
  { prop: 'type', label: t('system.menu.type'), type: 'select', itemList: menuTypeList },
  { prop: 'icon', label: t('system.menu.icon'), slots: { default: generateMenuIcon } },
  {
    prop: 'cache',
    label: t('common.cache'),
    itemList: getDictDetails(1, 'boolean'),
    slots: { default: switchSlot }
  },
  {
    prop: 'enabled',
    label: t('common.enabled'),
    itemList: getDictDetails(1, 'boolean'),
    slots: { default: switchSlot }
  },
  { prop: 'order', label: t('common.order'), comment: t('system.menu.orderComment') },
  { prop: 'createTime', label: t('common.createTime'), type: 'datetime', minWidth: 165 },
  { prop: 'updateTime', label: t('common.updateTime'), type: 'datetime', minWidth: 165 },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), icon: 'edit', auth: 'system:menu:edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        icon: 'document',
        auth: 'system:menu:detail',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        icon: 'delete',
        auth: 'system:menu:del',
        type: 'danger',
        onClick: (row) => del([row])
      },
      {
        label: t('common.copy'),
        type: 'success',
        icon: 'CopyDocument',
        auth: 'system:menu:add',
        onClick: (row) => openForm('copy', row)
      }
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

/**
 * 查询所有菜单并变成树形结构
 */
function fetchMenus(pageQuery, option) {
  // 转为树形结构
  return queryMenuList(pageQuery, option).then((res) => {
    res.data.list = generateTreeMenu(res.data.list)
    return res
  })
}

const expand = ref(false)

// 展开/收缩所有
function toggleExpand() {
  expand.value = !expand.value
  const arr = [...data.value]
  while (arr.length) {
    const menu = arr.pop()
    if (menu.children?.length) {
      arr.push(...menu.children)
      tableRef.value.tableRef.toggleRowExpansion(menu, expand.value)
    }
  }
}

//打开表单明细弹框
function openForm(type, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

// 生成菜单的图标
function generateMenuIcon(scope) {
  const menu = scope.row
  if (menu.type === 'btn') return '--'
  return (
    <m-icon
      {...{
        size: 18,
        value: menu.icon
      }}
    />
  )
}

function switchSlot(scope) {
  const row = scope.row
  if (scope.column.property === 'cache' && (row.type !== 'menu' || row.handleType === 'outer')) {
    return '--'
  }
  const prop = scope.column.property
  return (
    <el-switch
      size="small"
      v-model={row[prop]}
      beforeChange={async () => {
        const requestParam = {
          id: row.id,
          prop,
          value: !row[prop]
        }
        await postSwitchMenuProp(requestParam, { showLoading: true })
        return true
      }}
    />
  )
}

function del(rows) {
  delMenuByIds(rows.map((i) => i.id).join(','), {
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
.m-table {
  height: 100%;
}
</style>
