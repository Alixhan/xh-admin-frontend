<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="24"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">取消</el-button>
      <el-button
        v-if="['add', 'edit'].includes(handleType)"
        v-auth="['add', 'edit']"
        icon="check"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'
import { getUserById, postSaveUser } from '@/api/system/user'
import { getDownloadFileUrl } from '@/utils'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add',
  },
  modelValue: {},
})
const emit = defineEmits(['close'])

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({
  enabled: true
})

if (props.handleType !== 'add') {
  // 查询明细
  formLoading.value = true
  getUserById(props.modelValue.id).then((res) => {
    formData.value = res.data
    if ((formData.value.contentType ?? '').startsWith('image')) {
      formData.value.image = [
        {
          url: getDownloadFileUrl({ object: formData.value.object }),
          name: formData.value.name,
        },
      ]
    }
    formLoading.value = false
  })
}

// 表格列定义
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'code',
      label: '登录账号',
      rules: [{ required: true }, { pattern: /[a-zA-Z0-9]+/, message: '登录账号只能是大小写字母和数字！' }],
    },
    { prop: 'name', label: '用户名', rules: { required: true } },
    { prop: 'avatar', label: '头像', type: 'upload-img', single: 'object' },
    { prop: 'enabled', label: '是否启用', type: 'switch' },
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    postSaveUser(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功',
    }).then(() => close('refresh'))
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
