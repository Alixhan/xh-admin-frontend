<template>
  <div class="root">
    {{ useSystemStore().user?.name }}
    {{$t('sdfs')}}
    <el-button type="primary" @click="test(1)" style="width: 100px">查询</el-button>
    <el-tree
      :data="data"
      :props="{
        children: 'children',
        label: 'label',
      }"
      draggable
      show-checkbox
    />
  </div>
</template>
<script lang="jsx" setup>
import { useSystemStore } from '@/stores/system'
import { getMenuById } from '@/api/system/menu'

function test(id) {
  getMenuById(id).then((res) => {
    console.info(res)
  })
}

const data = [
  { id: 1, label: 'aaa' },
  { id: 2, label: 'bbb' },
  { id: 3, label: 'ccc' },
]
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
