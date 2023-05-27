<script lang="jsx">
/**
 * 增强ElDialog
 * sxh 2023-3-19
 */
import { defineComponent } from 'vue'
import { ElDialog } from 'element-plus'

export default defineComponent({
  extends: ElDialog,
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    alignCenter: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  setup: ElDialog.setup
})
</script>
<style scoped lang="scss"></style>
