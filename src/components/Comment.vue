<template>
    <el-icon class="comment-icon" title="点击查看详细说明" @click.stop="openComment">
        <QuestionFilled/>
    </el-icon>
</template>
<script setup name="MComment">
import { ElMessageBox } from 'element-plus'

/**
 * 疑问说明组件
 * sxh 2023-4-10
 */
const props = defineProps({
  label: {
    type: String,
  },
  comment: {
    required: true
  }
})

// 显示疑问注释信息
function openComment () {
  ElMessageBox({
    title: (props.label ?? '') + '❔',
    message: props.comment,
  }).catch(e => e)
}
</script>

<style scoped>
.comment-icon {
    margin-left: 5px;
    cursor: pointer;
}
</style>
