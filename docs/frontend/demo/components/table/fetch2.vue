<template>
  <m-table
    :columns="tableColumns"
    v-model:data="data"
    height="300"
    :fetch-data="queryMenuList"
    is-complex-filter
    is-filter-table
    :filter-param="filterParam"
    :filter-columns="topFilterColumns"
  />
</template>
<script setup lang="jsx">
import { computed, reactive, ref } from 'vue'
import { queryMenuList } from '@/api/system/menu'
import { menuTypeList } from '@/views/system/menu/constant'
import getDictDetails from '@/utils/dict'

const tableColumns = ref([
  { prop: 'title', label: '菜单名称', minWidth: 200 },
  { prop: 'id', label: 'Id', width: 90 },
  { prop: 'platform', label: '平台' },
  { prop: 'name', label: 'Name' },
  { prop: 'type', label: '菜单类型', type: 'select', itemList: menuTypeList },
  {
    prop: 'icon',
    label: '菜单图标',
    slots: {
      default: (scope) => {
        const menu = scope.row
        if (menu.type === 'btn') return '--'
        return <m-icon size={15} value={menu.icon} />
      }
    }
  },
  { prop: 'order', label: '排序号', comment: '排序号，小号在前，大号在后' },
  { prop: 'createTime', label: '创建时间', type: 'datetime', minWidth: 165 },
  { prop: 'updateTime', label: '修改时间', type: 'datetime', minWidth: 165 }
])

const filterParam = reactive({})

const topFilterColumns = computed(() => [
  { prop: 'title', label: '菜单名称' },
  { prop: 'enabled', label: '是否启用', type: 'select', itemList: getDictDetails(1, 'boolean') },
  { prop: 'createTimeStart', prop2: 'createTimeEnd', label: '创建时间', type:'daterange', single: true },
])

const data = ref([])
</script>
<style lang="scss" scoped></style>
