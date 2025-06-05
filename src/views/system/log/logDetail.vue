<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <el-descriptions class="margin-top" :column="systemStore.layout.widthShrink ? 1 : 2" border>
        <el-descriptions-item label="请求路径">{{ formData.url }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ formData.method }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ formData.tag }}</el-descriptions-item>
        <el-descriptions-item label="操作">{{ formData.operation }}</el-descriptions-item>
        <el-descriptions-item label="ip地址">{{ formData.ip }}</el-descriptions-item>
        <el-descriptions-item label="ip属地">{{ formData.ipAddress }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formData.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formData.endTime }}</el-descriptions-item>
        <el-descriptions-item label="耗时ms">{{ formData.time }}</el-descriptions-item>
        <el-descriptions-item label="响应状态">{{ formData.status }}</el-descriptions-item>
        <el-descriptions-item label="token">{{ formData.token }}</el-descriptions-item>
        <el-descriptions-item label="使用语言">{{ formData.locale }} {{ formData.localeLabel }}</el-descriptions-item>
        <el-descriptions-item label="使用机构">{{ formData.orgName }}</el-descriptions-item>
        <el-descriptions-item label="使用角色">{{ formData.roleName }}</el-descriptions-item>
        <el-descriptions-item label="用户名称">{{ formData.name }}</el-descriptions-item>
        <el-descriptions-item label="请求体类型">{{ formData.contentType }}</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <pre>{{ formData.requestParameter }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="请求体" :span="2">
          <pre>{{ formData.requestBody }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="响应体" :span="2">
          <pre>{{ formData.responseBody }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="异常堆栈" :span="2">
          <span>{{ formData.stackTrace }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import { getLogDetailById } from '@/api/system/log'
import { useSystemStore } from '@/stores/system'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})

const emit = defineEmits(['close'])

const systemStore = useSystemStore()

const formLoading = ref(false)
const formData = ref({})

if (props.handleType !== 'add') {
  formLoading.value = true
  // 查询明细
  getLogDetailById(props.modelValue.id).then((res) => {
    formData.value = res.data
    formLoading.value = false
  })
}

function close(type) {
  emit('close', type)
}
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;

    :deep(.el-descriptions__table) {
      table-layout: fixed;

      .el-descriptions__label {
        vertical-align: top;
        width: 7em;
      }
    }
  }
}
</style>
