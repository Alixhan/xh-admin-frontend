<script setup>
import DefaultTheme from "vitepress/theme";
</script>

<template>
  <DefaultTheme.Layout />
</template>
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
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
</style>
