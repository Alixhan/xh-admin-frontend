<template>
  <div>
    {{ formData }}
    <m-svg-icon />
    <el-input v-model="formData.ssd" />
    <el-pagination
        v-model:current-page="formData.currentPage1"
        :page-size="100"
        :small="false"
        background
        layout="total, prev, pager, next"
        :total="1000"
    />
  </div>
</template>
<script setup name="login">

import { reactive } from 'vue'
import { useSystemStore } from '@/store/system'

const formData = reactive({
  currentPage1: 1
})

const systemStore = useSystemStore()

</script>
<style lang="scss" scoped>
</style>
