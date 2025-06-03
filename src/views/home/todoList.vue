<template>
  <m-table :columns="tableColumns" :data="data" layout="stretch" :is-page="false">
    <template #left-action>
      <el-text style="white-space: nowrap">待办列表</el-text>
      <el-link type="primary" style="margin-left: 10px; white-space: nowrap" @click="more('点击了更多.')">更多</el-link>
    </template>
  </m-table>
</template>
<script lang="jsx" setup>
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

const tableColumns = computed(() => [
  { type: 'index', align: 'center' },
  { prop: 'title', label: '标题', width: 100 },
  {
    prop: 'desc',
    label: '描述',
    slots: {
      default: (scope) => {
        if (scope.row.title === '周报') {
          return (
            <span>
              {scope.row.desc}
              <el-link type="primary" underline="never" onClick={() => more('周报已填写')}>
                填写
              </el-link>
            </span>
          )
        }
        return scope.row.desc
      }
    }
  },
  { prop: 'expirationDate', label: '截止日期', type: 'date', width: 100 }
])
const data = [
  { title: '销售线索', desc: '李四的销售线索待更进', expirationDate: '2024-10-01' },
  { title: '温馨提示', desc: '下周冷空气下降，记得多穿衣服哦👻', expirationDate: '2024-10-01' },
  { title: '本月计划', desc: '期待更美好的事情😊✨', expirationDate: '2024-10-01' },
  { title: '周报', desc: '请及时填写周报！', expirationDate: '2024-04-01' }
]

function more(msg) {
  ElMessage({
    message: msg,
    type: 'success'
  })
}
</script>
<style lang="scss" scoped></style>
