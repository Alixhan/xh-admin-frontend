<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="props.handleType"
        v-model:loading="saveLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button icon="check" type="primary" :loading="saveLoading" @click="save"> 保存 </el-button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})
const emit = defineEmits(['close'])

const formRef = ref()
const saveLoading = ref(false)
const formData = ref({
  file: [],
  cache: true,
  enabled: true
})

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'file',
      label: '文件上传',
      type: 'upload-img',
      multiple: true,
      limit: 5
    },
    {
      prop: 'file2',
      label: '文件裁剪',
      type: 'upload-img',
      limit: 5,
      cropper: {}
    },
    {
      prop: 'file3',
      label: '文件上传',
      type: 'upload-file'
    },
    {
      prop: 'path',
      label: '路由路径',
      comment: (
        <span>
          web平台对应vue-router的path, 实际访问的路由路径会在浏览器地址栏显示，系统会自动拼接父级路径变成一个完整路径，
          <span style="color: red;">所以不用手动拼接父路由路径。</span>
        </span>
      )
    }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then((res) => {
    console.info(res)
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
  }
}
</style>
