<template>
  <div class="root">
    <m-table class="fff" selection="single" :columns="columns" v-model:data="data" layout="auto" :height="200"/>
  </div>
</template>
<script setup lang="ts">

import {ref} from 'vue'
import type {CommonTableColumn} from '@i/components/table'

const columns = ref<CommonTableColumn<any> []>([
  {type: 'index'},
  {type: 'operation'},
  {label: '字段1', prop: 'fd'},
  {label: '字段3', prop: 'gh', editable: true, editParam: {
      rules: [
        {required: true}
      ],
    }},
  {
    label: '字段2', prop: 'fd2', prop2: 'fd22', type: 'daterange', editable: true,
    required: true,
    editParam: {
      single: true
    }
  },
])

const data = ref([
  {fd: '房东', fd2: '2023-11-08', fd22: '2023-11-09'}
])

</script>
<style lang="scss" scoped>
.root {
  background: var(--el-bg-color);

  .fff {
    padding: 20px;
  }
}

</style>
