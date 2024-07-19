<template>
  <div class="mermaid-view" v-html="svg" />
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import { onMounted, ref, toRef, watchEffect } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  id: string
  code: string
}>()

const svg = ref('')

const isDark = toRef(useData(), 'isDark')

onMounted(() => {
  function render() {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark.value ? 'dark' : 'default'
    })
    mermaid.render(props.id, decodeURIComponent(props.code)).then((res) => (svg.value = res.svg))
  }

  watchEffect(render)
})
</script>

<style scoped>
.mermaid-view {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
