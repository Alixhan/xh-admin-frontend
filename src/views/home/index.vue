<template>
  <div class="root">
    {{ useSystemStore().user?.name }}
    <el-button type="primary" @click="test(1)" style="width: 100px">查询</el-button>
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
