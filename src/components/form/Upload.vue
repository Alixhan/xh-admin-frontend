<template>
  <el-upload :="uploadParam" ref="uploadRef">
    <el-button>upload</el-button>
    <el-button @click.stop="upload">upload</el-button>
  </el-upload>
</template>
<script setup name="MUpload">
/**
 * 增强el-upload上传功能，增加裁剪，直接粘贴图片文件等。
 * sxh 2023-4-14
 */
import { computed, ref, useAttrs, watchEffect } from 'vue'

const emit = defineEmits(['update:fileList', 'update:modelValue'])

const props = defineProps({
  type: {
    type: String,
  },
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  cropper: {
    type: Object,
  },
})

const attrs = useAttrs()

const uploadRef = ref()

const uploadParam = computed(() => {
  const param = {
    ...attrs,
    ...props,
    fileList: fileList.value,
    autoUpload: false,
    'onUpdate:fileList': onUpdateFileList,
  }
  // 需要裁剪的图片一次只能选择一张
  if (props.cropper) param.multiple = false
  // 上传图片默认卡片格式
  if (props.type === 'uploadImg') {
    param.listType = 'picture-card'
  }
  return param
})

const fileList = ref([])
watchEffect(() => {
  fileList.value = props.modelValue
})

function onUpdateFileList (files) {
  fileList.value = files
  emit('update:fileList', files)
  console.info(files)
}

function upload () {
  emit('update:modelValue', fileList.value)
  fileList.value[0].status = 'uploading'
  // 'ready' | 'uploading' | 'success' | 'fail'
}
</script>
<style scoped lang="scss">
</style>
