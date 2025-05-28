<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px">
    <template #left-action>
      <el-text style="margin-right: 10px"> 按钮数:</el-text>
      <el-radio-group v-model="type">
        <el-radio :value="4" label="0" />
        <el-radio :value="3" label="1" />
        <el-radio :value="2" label="2" />
        <el-radio :value="1" label="3" />
        <el-radio :value="0" label="4" />
      </el-radio-group>
      <el-text style="margin: 0 10px"> maxCount:</el-text>
      <el-radio-group v-model="maxCount">
        <el-radio :value="2" label="2" />
        <el-radio :value="3" label="3" />
      </el-radio-group>
    </template>
  </m-table>
</template>
<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const type = ref(0)
const maxCount = ref(2)

const tableColumns = computed(() => {
  const buttons = [
    { type: 'danger', label: '操作一', icon: 'document', onClick: (row) => console.info(row.title) },
    { type: 'warning', label: '操作二', icon: 'MagicStick', onClick: (row) => console.info(row.title) },
    { type: 'info', label: '操作三', icon: 'Key', onClick: (row) => console.info(row.title) },
    { type: 'primary', label: '操作四', icon: 'delete', onClick: (row) => console.info(row.title) }
  ]
  buttons.splice(0, type.value)
  return [
    { type: 'index', align: 'center' },
    { prop: 'title', label: '标题' },
    { prop: 'expirationDate', label: '截止日期' },
    { type: 'operation', align: 'center', maxCount: maxCount.value, buttons }
  ]
})

const data = ref([])

for (let i = 0; i < 54; i++) {
  data.value.push({
    title: '标题' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
