<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll">
      <m-form
        ref="formRef"
        :colspan="12"
        :columns="columns"
        :model="formData"
        :handleType="handleType"
        :loading="formLoading"
      />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['system:file:add', 'system:file:edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, watchEffect } from 'vue'
import { getFileById, postSaveFile } from '@/api/file/fileOperation'
import { statusList } from '@/views/system/file/constant'
import { getDownloadFileUrl } from '@/utils'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  handleType: {
    type: String,
    default: 'add'
  },
  modelValue: {}
})

const { t } = useI18n()
const emit = defineEmits(['close'])

const formLoading = ref(false)
const formRef = ref()
const saveLoading = ref(false)
const formData = ref({})

if (props.handleType !== 'add') {
  formLoading.value = true
  // 查询明细
  getFileById(props.modelValue.id).then((res) => {
    formData.value = res.data
    if ((formData.value.contentType ?? '').startsWith('image')) {
      formData.value.image = [
        {
          url: getDownloadFileUrl({ object: formData.value.object }),
          name: formData.value.name
        }
      ]
    }
    formLoading.value = false
  })
}

// 表单字段根据表单数据变化，有所不同
const columns = ref([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'image',
      label: t('system.file.preview'),
      type: 'upload-img',
      cols: 2,
      hidden: !(formData.value.contentType ?? '').startsWith('image'),
      disabled: true
    },
    { prop: 'object', label: t('system.file.object'), disabled: true },
    { prop: 'name', label: t('system.file.name'), rules: { required: true } },
    { prop: 'contentType', label: t('system.file.contentType'), disabled: true },
    { prop: 'suffix', label: t('system.file.suffix'), disabled: true },
    { prop: 'size', label: t('system.file.size'), disabled: true },
    { prop: 'imgWidth', label: t('system.file.imgWidth'), disabled: true },
    { prop: 'imgHeight', label: t('system.file.imgHeight'), disabled: true },
    { prop: 'imgRatio', label: t('system.file.imgRatio'), disabled: true },
    {
      prop: 'status',
      label: t('system.file.status'),
      type: 'select',
      itemList: statusList,
      disabled: true
    },
    {
      prop: 'sha1',
      label: t('system.file.sha1'),
      disabled: true,
      comment: t('system.file.sha1Comment')
    },
    { prop: 'createTime', label: t('system.file.createTime'), disabled: true }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    postSaveFile(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
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
