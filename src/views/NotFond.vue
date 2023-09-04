<template>
  <div class="root">
    <m-svg-icon src="@/" />
    <div class="cl1">404</div>
    <div class="cl2">抱歉！</div>
    <div class="cl3">当前页面未找到</div>
    <div class="cl4">请检查地址是否输入正确，或者联系管理员处理。</div>
    <div style="height: 50px;"></div>
  </div>
</template>
<script setup>
import MSvgIcon from "@/components/SvgIcon.vue";
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    opacity: 0;
    animation-fill-mode: forwards;
    padding: 7px;
    animation-name: fadeInFromBottom;
    animation-duration: 0.8s;
  }

  background-color: var(--el-bg-color);

  .cl1 {
    font-weight: bold;
    font-size: 40px;
    animation-delay: 0.5s;
  }

  .cl2 {
    color: var(--el-color-primary);
    font-weight: bold;
    font-size: 40px;
    animation-delay: 0.7s;
  }

  .cl3 {
    font-weight: bold;
    font-size: 20px;
    animation-delay: 0.9s;
  }

  .cl4 {
    font-size: 14px;
    animation-delay: 1.1s;
    animation-duration: 1.2s;
  }
}

@keyframes fadeInFromBottom {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
