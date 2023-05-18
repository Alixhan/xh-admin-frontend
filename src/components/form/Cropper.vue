<template>
  <div ref="cropperRoot">
    <el-scrollbar class="m-form-scroll">
      <div class="cropperView">
        <div class="item-class">
          <div>
            <vue-cropper ref="cropper" :style="itemStyle" :="ctx"/>
            <div class="btn-view">
              <el-button type="primary" @click="cropper.refresh()">刷新</el-button>
              <el-button type="primary" @click="changeScale(1)">放大</el-button>
              <el-button type="primary" @click="changeScale(-1)">缩小</el-button>
              <el-button type="primary" @click="cropper.rotateRight()">顺时针</el-button>
              <el-button type="primary" @click="cropper.rotateLeft()">逆时针</el-button>
            </div>
          </div>
        </div>
        <div>
          <div class="item-class" :style="itemStyle" style="background-color: var(--el-border-color);">
            <div style="overflow: hidden;margin: 5px"
                 :style="{'width': previews.w + 'px', 'height': previews.h + 'px'}">
              <div :style="previews.div" class="preview-view">
                <img :src="previews.url" :style="previews.img" alt="">
              </div>
            </div>
          </div>
          <div class="btn-view" style="justify-content: flex-end;">
            <el-button type="primary" @click="sure">确定裁剪</el-button>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
/**
 * 图片裁剪。
 * sxh 2023-5-16
 */
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { computed, ref, useAttrs, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

const emit = defineEmits(['cropper'])

const props = defineProps({
  img: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false
  },
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

const previews = ref({})

const formSize = ref(useElementSize(cropperRoot))
const itemStyle = ref({})
watchEffect(() => {
  let width = Number(formSize.value.width) / 2
  if (width > 400) {
    width = 400
  }
  itemStyle.value = {
    width: width - 10 + 'px',
    height: width - 10 + 'px',
  }
})

// 实时裁剪预览
function onRealTime (data) {
  previews.value = data
}

function changeScale (num) {
  num = num || 1
  cropper.value.changeScale(num)
}

function rotateLeft () {
  cropper.value.rotateLeft()
}

function rotateRight () {
  cropper.value.rotateRight()
}

function sure () {
  cropper.value.getCropBlob(blob => {
    emit('cropper', blob)
  })
}
</script>
<style scoped lang="scss">
.cropperView {
  width: 100%;
  display: flex;
  justify-content: space-around;
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
}
</style>
