<template>
  <el-upload v-bind="uploadParam" ref="uploadRef">
    <template v-for="name in Object.keys($slots)" #[name]="ctx">
      <slot :name="name" v-bind="ctx" />
    </template>
    <template v-if="!$slots.tip" #tip>
      <div>
        {{ props.tip }}
      </div>
    </template>
    <!--    <template v-if="!$slots.file" #file="{ file }">-->
    <!--      <div>-->
    <!--        <el-image :src="file.url" style="position: absolute; inset: 0px;" fit="cover"/>-->
    <!--        <span class="el-upload-list__item-actions">-->
    <!--          <span class="el-upload-list__item-preview" @click="onPreview(file)">-->
    <!--            <el-icon><zoom-in/></el-icon>-->
    <!--          </span>-->
    <!--          <span v-if="!disabled" class="el-upload-list__item-delete" @click="onDownload(file)">-->
    <!--            <el-icon><Download/></el-icon>-->
    <!--          </span>-->
    <!--          <span v-if="!disabled" class="el-upload-list__item-delete" @click="uploadRef.handleRemove(file)">-->
    <!--            <el-icon><Delete/></el-icon>-->
    <!--          </span>-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </template>-->
    <template #trigger>
      <div v-if="type === 'upload-img'" class="el-upload--picture-card">
        <div class="file-lib-btn" @click.stop="visible = true">文件库</div>
        <Plus class="icon" />
      </div>
      <div v-else>
        <el-button icon="plus" @click.stop="visible = true" />
        <el-button type="primary" icon="upload">选择文件</el-button>
      </div>
    </template>
    <el-image-viewer
      teleported
      v-if="previewImageVisible"
      :url-list="previewImageUrlList"
      hide-on-click-modal
      :initial-index="initialIndex"
      @close="previewImageVisible = false"
    />
    <el-dialog title="选择文件" v-model="visible" align-center draggable append-to-body
               destroy-on-close :close-on-click-modal="false" width="90%">
      <selectSysFile
        :selection="selection"
        :selection-limit="selectLimit"
        style="height: calc(90vh - 80px)"
        @select="select"
        @close="visible = false"
      />
    </el-dialog>
    <el-dialog title="图片裁剪" v-model="visible2" align-center draggable append-to-body
               destroy-on-close :close-on-click-modal="false" width="70%">
      <cropper :="cropperOption" @close="visible2 = false" />
    </el-dialog>
  </el-upload>
</template>
<script setup lang="ts">
/**
 * 增强el-upload上传功能，增加裁剪，直接粘贴图片文件等。
 * sxh 2023-4-14
 */
import { computed, inject, onUnmounted, ref, useAttrs, watchEffect } from 'vue'
import { uploadFile } from '@/api/file/fileOperation'
import selectSysFile from '@/views/system/file/selectSysFile.vue'
import { getDownloadFileUrl } from '@/utils'
import Cropper from './Cropper.vue'

defineOptions({
  name: 'MUpload'
})

const emit = defineEmits(['update:fileList', 'update:modelValue'])

const props = defineProps({
  type: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  cropper: {
    type: Object
  },
  tip: {
    type: String
  },
})

const attrs = useAttrs()

const uploadRef = ref()

const uploadParam = computed(() => {
  const defaultParam: {
    autoUpload?: boolean
    listType?: string
    accept?: string
  } = {
    autoUpload: false
  }

  // 上传图片默认参数
  if (props.type === 'upload-img') {
    defaultParam.listType = 'picture-card'
    defaultParam.accept = 'image/*'
  }
  const param = {
    ...defaultParam,
    ...attrs,
    ...props,
    fileList: fileList.value,
    onChange,
    onRemove,
    onPreview,
    // 需要裁剪的图片一次只能选择一张
    multiple: !props.cropper
  }
  return param
})

const fileList = ref<any[]>([])
watchEffect(() => {
  fileList.value = props.modelValue ?? []
})

const previewImageUrlList = ref<string[]>([])
const previewImageVisible = ref(false)
const initialIndex = ref(1)

const visible = ref(false)
const selection = ref('multiple')
const selectLimit = computed(() => {
  if (attrs.limit) {
    return Number(attrs.limit) - fileList.value.length
  }
  return undefined
})

const visible2 = ref(false)
const cropperOption = ref({})
const cropperFile = ref()

function onChange(file, files) {
  if (props.cropper) {
    visible2.value = true
    cropperOption.value = {
      img: file.url,
      onCropper(blob) {
        const fileName = cropperFile.value.name.replace(/\.[0-9a-z]+$/, '') + '.png'
        const file = new File([blob], fileName, { type: blob.type })
        fileList.value.push({
          ...cropperFile.value,
          name: fileName,
          raw: file,
          size: file.size,
          // @ts-ignore
          url: (window.createObjectURL || window.URL.createObjectURL)(file),
        })
        visible2.value = false
      },
      ...props.cropper,
    }
    cropperFile.value = file
    files.pop()
  }
  onUpdateFileList(file, files)
  attrs.onChange instanceof Function &&  attrs.onChange?.(file, files)
}

function onRemove(file, files) {
  onUpdateFileList(file, files)
  attrs.onRemove instanceof Function &&  attrs.onRemove?.(file, files)
}

function onUpdateFileList(file, files) {
  fileList.value = files
  emit('update:modelValue', fileList.value)
}

function onPreview(file) {
  if (props.type === 'upload-img') {
    previewImageUrlList.value = fileList.value.map((i) => i.url)
    initialIndex.value = fileList.value.findIndex((i) => i === file)
    previewImageVisible.value = true
  } else {
    if (file.object) {
      window.open(getDownloadFileUrl({ object: file.object, fileName: file.name }))
    }
  }
}
//
// function onDownload (file) {
//   previewImageUrlList.value = fileList.value.map((i) => i.url)
//   initialIndex.value = fileList.value.findIndex((i) => i === file)
//   previewImageVisible.value = true
// }

// 图片库选择后事件
function select(rows) {
  onUpdateFileList(null, [
    ...fileList.value,
    ...rows.map((i) => {
      return {
        url: getDownloadFileUrl({ object: i.object }),
        status: 'success',
        id: i.id,
        name: i.name,
        object: i.object,
        contentType: i.contentType,
        suffix: i.suffix,
        size: i.size,
        imgWidth: i.imgWidth,
        imgHeight: i.imgHeight,
        imgRatio: i.imgRatio
      }
    })
  ])
  visible.value = false
}

// 文件手动上传
async function upload() {
  // 'ready' | 'uploading' | 'success' | 'fail'
  const uploadFiles = fileList.value.filter((i) => ['ready', 'fail'].includes(i.status))
  while (uploadFiles.length) {
    const item = uploadFiles.shift()
    item.status = 'uploading'
    try {
      const res = await uploadFile(item.raw, (progressEvent) => {
        item.percentage = (progressEvent.loaded! / progressEvent.total!) * 100
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
    } catch (e) {
      item.status = 'fail'
    }
  }
  emit('update:modelValue', fileList.value)
}

export interface UploadCtx {
  upload: () => Promise<void>
}

const ctx: UploadCtx = {
  upload
}
defineExpose(ctx)
const uploadInstances: UploadCtx[] = inject('uploadInstances', [])
if (uploadInstances) {
  uploadInstances.push(ctx)
  onUnmounted(() => {
    const index = uploadInstances.findIndex((i) => i === ctx)
    uploadInstances.splice(index, 1)
  })
}
</script>
<style scoped lang="scss">
.el-upload--picture-card {
  position: relative;

  .file-lib-btn {
    color: var(--el-text-color-regular);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 5px 5px 10px 10px;
    border: 1px dashed var(--el-border-color);
    text-align: center;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }

  .icon {
    width: 25px;
    height: 25px;
    color: var(--el-border-color-dark);
  }

  &:hover {
    .icon {
      color: var(--el-color-primary);
    }
  }
}

:deep(.is-disabled .el-upload) {
  display: none;
}
</style>
