<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form ref="formRef" :colspan="12" :columns="columns" :model="formData" :handleType="handleType" />
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
import { getFileById, postSaveFile } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
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
const saveLoading = ref(false)
const formData = ref({})

if (props.handleType !== 'add') {
  // 查询明细
  getFileById(props.modelValue.id).then((res) => {
    formData.value = res.data
    if ((formData.value.contentType ?? '').startsWith('image')) {
      formData.value.image = [
        {
          url: getDownloadFileUrl({ object: formData.value.object }),
          name: formData.value.name,
        },
      ]
    }
  })
}

// 表格列定义
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'image',
      label: '图片预览',
      type: 'upload-img',
      cols: 2,
      hidden: !(formData.value.contentType ?? '').startsWith('image'),
      disabled: true,
    },
    { prop: 'object', label: '对象存储key', disabled: true },
    { prop: 'name', label: '文件名', rules: { required: true } },
    {
      prop: 'contentType',
      label: '文件类型',
      disabled: true,
      comment: '文件的MIME类型',
    },
    { prop: 'suffix', label: '文件后缀扩展名', disabled: true },
    { prop: 'size', label: '文件大小', disabled: true },
    { prop: 'imgWidth', label: '图片宽度', disabled: true },
    { prop: 'imgHeight', label: '图片高度', disabled: true },
    { prop: 'imgRatio', label: '图片宽高比', disabled: true },
    {
      prop: 'status',
      label: '文件状态',
      type: 'select',
      itemList: statusList,
      disabled: true,
    },
    {
      prop: 'sha1',
      label: '文件摘要sha1',
      disabled: true,
      comment: '同一个文件的sha1相同，相同sha1不会重复上传文件',
    },
    { prop: 'createTime', label: '上传时间', disabled: true },
  ]
})

// 保存方法
function save() {
  formRef.value.validate().then(() => {
    postSaveFile(formData.value, {
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
