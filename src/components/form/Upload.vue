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
import { uploadFile } from '@/api/file/fileOperation'

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
    onChange: onUpdateFileList,
    onRemove: onUpdateFileList,
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

function onUpdateFileList (file, files) {
  fileList.value = files
  emit('update:fileList', files)
  console.info(files)
}

async function upload () {
  // 'ready' | 'uploading' | 'success' | 'fail'
  const uploadFiles = fileList.value.filter(i => ['ready', 'fail'].includes(i.status))
  while (uploadFiles.length) {
    const item = uploadFiles.shift()
    item.status = 'uploading'
    const res = await uploadFile(item.raw, progressEvent => {
      item.percentage = progressEvent.progress * 100
    })
    item.status = 'success'
    item.id = res.data.id
    item.name = res.data.name
    item.object = res.data.object
    item.contentType = res.data.contentType
    item.suffix = res.data.suffix
    item.size = res.data.size
    item.imgWidth = res.data.imgWidth
    item.imgHeight = res.data.imgHeight
    item.imgRatio = res.data.imgRatio
  }
  emit('update:modelValue', fileList.value)
  console.info(fileList.value)
}

defineExpose({
  upload,
})
</script>
<style scoped lang="scss">
</style>
