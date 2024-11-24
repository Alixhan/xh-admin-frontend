<template>
  <el-icon class="comment-icon" :title="$t('m.comment')" @click.prevent.stop="openComment">
    <QuestionFilled />
  </el-icon>
</template>
<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import type { PropType } from 'vue'
import type { ElMessageBoxOptions } from 'element-plus/es/components/message-box/src/message-box.type'

/**
 * 疑问说明组件
 * sxh 2023-4-10
 */
defineOptions({
  name: 'MComment'
})

const props = defineProps({
  label: {
    type: String
  },
  comment: {
    required: true,
    type: [Object, String] as PropType<ElMessageBoxOptions['message']>
  }
})

// 显示疑问注释信息
function openComment() {
  ElMessageBox({
    title: (props.label ?? '') + '❔',
    message: props.comment
  }).catch((e) => e)
}
</script>

<style scoped>
.comment-icon {
  margin-left: 5px;
  cursor: pointer;
}
</style>
