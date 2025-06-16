<template>
  <div class="el-text">
    <el-radio-group v-model="status">
      <el-radio value="success" label="模拟导入成功" />
      <el-radio value="error" label="模拟后端导入失败" />
    </el-radio-group>
    <el-input v-model="fileName">
      <template #append>.xlsx</template>
    </el-input>
    <el-button class="button" @click="visible = true" type="primary">导入</el-button>
    <el-dialog title="Excel 导入" v-model="visible" align-center destroy-on-close draggable append-to-body width="80%">
      <m-excel-import
        :template-file-name="fileName"
        :columns="excelColumns"
        :init-data="initData"
        :on-complete="complete"
        style="height: 75vh"
      />
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import MExcelImport from '@/components/ExcelImport.vue'
import { ElNotification } from 'element-plus'

const visible = ref(false)
const status = ref('success')

const excelColumns = computed(() => [
  {
    label: '基本信息',
    align: 'center',
    note: '这是基本信息哈',
    children: [
      { prop: 'code', label: '登录账号', rules: [{ required: true }], note: '字母和数字组合' },
      { prop: 'name', label: '用户名', rules: [{ required: true }] },
      { prop: 'telephone', label: '手机号', rules: [{ type: 'phone' }] }
    ]
  },
  {
    label: '其他信息',
    align: 'center',
    children: [
      { prop: 'onlyNum', label: '仅数字列', rules: { pattern: /\d+/ } },
      { prop: 'date', label: '日期类型', rules: { dateFormat: 'YYYY-MM-DD' } },
      {
        prop: 'custom',
        label: '自定义验证',
        rules: [
          { required: true },
          {
            validator: (rule, val, callback) => {
              if (val.length === 5) return callback(new Error('可以自定义验证啊！！'))
              callback()
            }
          }
        ]
      }
    ]
  }
])

// 开始导入数据
async function complete(data) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (status.value === 'error') {
    return [{ rowIndex: 0, error: '该用户已经存在了！' }]
  }
  ElNotification({
    type: 'success',
    message: `导入成功了 ${data.length} 条数据`
  })
}

const fileName = ref('定制下载模板的文件名称')

const initData = [
  {
    code: 'ceshi',
    telephone: '18888888888',
    onlyNum: '122',
    date: '2024-05-01',
    custom: '五个字符会报错'
  },
  {
    code: 'xhan',
    telephone: '18888888888',
    onlyNum: 'ggg',
    date: '2028-22-01',
    custom: '水电费反反复复'
  },
  {
    code: 'xhan',
    telephone: '晓寒',
    onlyNum: '18888888888',
    date: '18888888888',
    custom: '12345'
  }
]
</script>
<style lang="scss" scoped>
.el-text {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .button {
    width: 100px;
  }
}
</style>
