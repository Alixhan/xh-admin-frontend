<script setup>
import DefaultTheme from "vitepress/theme";
import Icpba from '@/layout/icpba.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <div style="text-align: center">
        <Icpba/>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
<style lang="scss">
:root {
  --line-gradient-bg: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: var(--line-gradient-bg);
}

.image-bg {
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: 192px;
  height: 192px;
  background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%) !important;
  filter: blur(70px) !important;
  transform: translate(-50%, -50%) !important;
}

.VPLink .text {
  transition: all .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  transform-origin: 0 50%;

  &:hover {
    transform: scale(1.1);

  }
}

.is-active > .item > .VPLink > .text {
  transform: scale(1.1);
}


h1 { // h1 标签渐变色文本
  display: inline-block;
  -webkit-background-clip: text;
  background-clip: text;
  color: #0000;
  white-space: nowrap;
  background-image: var(--line-gradient-bg);
  margin-bottom: 20px;
}

</style>
