<template>
  <div class="el-text">
    <m-form label-width="7em" :columns="columns" :model="formData" />
    {{ formData }}
  </div>
</template>

<script setup lang="ts">
import useDictDetails from '@/utils/dict'
import { ref } from 'vue'

const formData = ref({})

const columns = [
  { label: 'string 类型', prop: 'string', type: 'radio-group', itemList: useDictDetails(1, 'string') },
  { label: 'number 类型', prop: 'number', type: 'radio-group', itemList: useDictDetails(1, 'number') },
  { label: 'boolean 类型', prop: 'boolean', type: 'radio-group', itemList: useDictDetails(1, 'boolean') }
]
</script>
