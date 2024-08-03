<template>
  <m-table ref="tableRef" :columns="tableColumns" v-model:data="data" height="300">
    <template #left-action>
      <el-button type="primary" @click="doValid"> 表格数据验证</el-button>
    </template>
  </m-table>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

const tableColumns = [
  { type: 'index', align: 'center' },
  { prop: 'remark', label: '备注' },
  { prop: 'ff', label: '值' },
  {
    prop: 'ff',
    label: '灵活配置',
    editable: true,
    editParam({ row, $fullIndex }) {
      const param = {
        size: 'small',
        rules: [{ required: $fullIndex % 2 === 0, message: `灵活配置${$fullIndex}必填` }]
      }
      if ($fullIndex === 0) param.type = 'number'
      else if ($fullIndex === 1) param.type = 'password'
      else if ($fullIndex === 2) param.type = 'date'
      else if ($fullIndex === 3) param.type = 'rate'
      else if ($fullIndex === 4) param.type = 'year'
      else if ($fullIndex === 5) param.type = 'color-picker'
      else if ($fullIndex === 6) {
        param.slots = {
          append: () => (
            <el-button size="small" type="primary">
              {row.remark}
            </el-button>
          )
        }
      }
      return param
    }
  }
]

const data = ref([])

for (let i = 0; i < 7; i++) {
  data.value.push({
    remark: '备注' + i
  })
}

const tableRef = ref()

async function doValid() {
  await tableRef.value.validate()
  ElNotification.success('验证成功')
}
</script>
<style lang="scss" scoped></style>
