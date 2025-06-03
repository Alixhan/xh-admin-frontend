<template>
  <ClientOnly>
    <div class="vp-demo">
      <div class="vp-raw">
        <component :is="component" />
      </div>
      <div class="action-view">
        <el-tooltip effect="dark" content="源代码" :show-arrow="false">
          <el-icon @click="showCode = !showCode">
            <View />
          </el-icon>
        </el-tooltip>
      </div>
      <el-collapse-transition>
        <div v-show="showCode" ref="sourceCodeRef">
          <slot name="raw" />
          <el-link class="vp-raw collapse-view" underline="never" @click="showCode = false" icon="ArrowUp">
            收起
          </el-link>
        </div>
      </el-collapse-transition>
    </div>
  </ClientOnly>
</template>
<script setup>
import { ref, shallowRef } from 'vue'
import { ElCollapseTransition } from 'element-plus'

const demos = import.meta.glob(`@d/document/frontend/demo/**/*.*`)

defineOptions({
  name: 'VpDemo'
})

const props = defineProps({
  path: String
})

const component = shallowRef()
demos[`/document/frontend/demo/${props.path}`]().then((res) => {
  component.value = res.default
})

const showCode = ref(false)
const sourceCodeRef = ref()
</script>
<style scoped>
.vp-demo {
  border: var(--el-border);
  border-radius: 4px;
  margin-bottom: 10px;

  .vp-raw {
    padding: 10px;
  }

  .action-view {
    display: flex;
    justify-content: end;
    padding: 5px 10px;
    border-top: var(--el-border);

    > * {
      cursor: pointer;
    }
  }

  .collapse-view {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 3;
    padding: 5px;
    background: var(--vp-c-bg);
    border-top: var(--el-border);
    border-radius: 0 0 4px 4px;
  }
}

:global(.vp-demo .vp-adaptive-theme) {
  border-radius: 0 !important;
  margin: 0 !important;
}
</style>
