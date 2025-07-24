<template>
  <div ref="cropperRoot">
    <el-scrollbar class="m-form-scroll">
      <div class="cropperView">
        <vue-cropper ref="cropper" :style="itemStyle" v-bind="ctx" />
        <div class="item-class" :style="itemStyle" style="background-color: var(--el-border-color)">
          <div style="overflow: hidden" :style="{ width: previews.w + 'px', height: previews.h + 'px' }">
            <div :style="previews.div" class="preview-view">
              <img :src="previews.url" :style="previews.img" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="cropperView">
        <div class="btn-view">
          <el-button type="primary" @click="cropper.refresh()">{{ $t('m.form.refresh') }}</el-button>
          <el-button type="primary" @click="changeScale(1)">{{ $t('m.form.enlarge') }}</el-button>
          <el-button type="primary" @click="changeScale(-1)">{{ $t('m.form.reduce') }}</el-button>
          <el-button type="primary" @click="cropper.rotateRight()">{{ $t('m.form.clockwise') }}</el-button>
          <el-button type="primary" @click="cropper.rotateLeft()">{{ $t('m.form.anticlockwise') }}</el-button>
        </div>
        <div class="btn-view">
          <el-button type="primary" @click="sure">{{ $t('m.form.cutConfirmation') }}</el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
/**
 * 图片裁剪。
 * sxh 2023-5-16
 */
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { computed, ref, useAttrs, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

defineOptions({
  name: 'MCropper'
})

const emit = defineEmits<{
  (e: 'cropper', data: Blob): void
}>()

const props = defineProps({
  // 裁剪图片的地址
  img: {
    type: String
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const cropper = ref()
const cropperRoot = ref()
const attrs = useAttrs()

const ctx = computed(() => {
  return {
    autoCrop: true,
    outputType: 'png',
    ...attrs,
    ...props,
    onRealTime
  }
})

const previews = ref<any>({})

const formSize = ref(useElementSize(cropperRoot))
const itemStyle = ref({})
watchEffect(() => {
  let width = Number(formSize.value.width) / 2
  if (width > 400) {
    width = 400
  }
  itemStyle.value = {
    width: width - 10 + 'px',
    height: width - 10 + 'px'
  }
})

// 实时裁剪预览
function onRealTime(data: any) {
  previews.value = data
}

function changeScale(num: number) {
  num = num || 1
  cropper.value.changeScale(num)
}

function sure() {
  cropper.value.getCropBlob((blob: Blob) => {
    emit('cropper', blob)
  })
}
</script>
<style scoped lang="scss">
img {
  max-width: none;
}
.cropperView {
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.item-class {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-view {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
}

.btn-view {
  display: flex;
  padding: 10px 0;
  flex-basis: 50%;
  justify-content: center;
}
</style>
