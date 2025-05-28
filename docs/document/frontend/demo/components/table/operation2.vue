<template>
  <m-table :columns="tableColumns" v-model:data="data" layout="auto" max-height="300px">
    <template #left-action>
      隐藏按钮：<el-switch v-model="hidden"></el-switch>
    </template>
  </m-table>
</template>
<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const hidden = ref(false)

const tableColumns = computed(() => {
  return [
    { type: 'index', align: 'center' },
    { prop: 'title', label: '标题' },
    { prop: 'expirationDate', label: '截止日期' },
    {
      type: 'operation',
      align: 'center',
      buttons: [
        { type: 'danger', label: '操作一', icon: 'document', hidden: hidden.value },
        { type: 'warning', label: '操作二', icon: 'MagicStick', hidden: hidden.value },
        { type: 'info', label: '操作三', icon: 'Key' },
        { type: 'primary', label: '操作四', icon: 'delete', onClick: (row) => console.info(row.title) }
      ]
    }
  ]
})

const data = ref([])

for (let i = 0; i < 3; i++) {
  data.value.push({
    title: '标题' + i,
    expirationDate: new dayjs().add(i, 'days').format('YYYY-MM-DD')
  })
}
</script>
<style lang="scss" scoped></style>
