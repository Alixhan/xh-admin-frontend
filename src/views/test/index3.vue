<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      form-type="add"
      is-filter-table
      :columns="columns"
      :data="data"
      selection="multiple"
      @row-click="rowClick"
    >
      <template #right-action>
        <el-input v-model="num" style="width: 100px" />
        <el-button type="primary" @click="formVisible = true">弹窗</el-button>
        <el-button type="primary" @click="add">添加数据</el-button>
        <el-button type="primary" @click="validTable">表单验证</el-button>
        <el-button type="primary" @click="tableRef.fetchQuery()">查询</el-button>
      </template>
    </m-table>
    <el-dialog
      title="ffff"
      v-model="formVisible"
      align-center
      draggable
      destroy-on-close
      append-to-body
      :close-on-click-modal="false"
      width="70%"
    >
      <FormDetail handle-type="add" style="height: 75vh" @close="formVisible = false" />
    </el-dialog>
  </div>
</template>
<script lang="jsx" setup>
import { ref } from 'vue'
import FormDetail from './formDetail.vue'

const num = ref(2)

const tableRef = ref()
const formVisible = ref(false)

const columns = ref([
  {
    fixed: true,
    label: '序',
    type: 'index',
  },
  {
    label: 'id',
    children: [
      { prop: 'ff', label: 'hg', notExport: true },
      { prop: 'ff', label: '鬼地方个' },
    ],
  },
  {
    label: '层级',
    children: [
      { prop: 'ff', label: '缓解经' },
      {
        prop: 'ff',
        label: '发发撒啊发发发',
        children: [{ prop: 'ff', label: '开会' }],
      },
    ],
  },
  {
    prop: 'a',
    label: '胸衣',
    width: 100,
    editable: true,
    // editParam: {
    //   rules: { required: true },
    // }
  },
  {
    prop: 'a',
    label: '女不女',
    width: 100,
  },
  {
    prop: 'a',
    label: '存不存v',
    width: 100,
  },
])
const data = ref([])

add()

function rowClick(row) {
  console.info(row)
}

function validTable() {
  tableRef.value.validate().then((r) => {
    console.info(r)
  })
}

function add() {
  for (let i = 0; i < num.value; i++) {
    data.value.push({
      id: data.value.length,
      ssd2: '123',
      a: '123123',
      field3: '123123',
      top8: '123123',
      top9: '1231231',
    })
  }
}
</script>
<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;

  .m-table {
    flex-grow: 1;
    height: 0;
  }
}
</style>
