<template>
  <div class="root">
    <div class="content" :key="route.fullPath">
      <img src="@/assets/image/404.png" alt="Not Found" />
      <div>
        <div class="cl2">抱歉！</div>
        <div class="cl3">当前页面未找到</div>
        <div class="cl4">可能是无权限访问，请检查地址是否输入正确，或者联系管理员处理。</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);

  .content {
    vertical-align: middle;
    display: grid;

    grid-template-columns: auto auto;
    align-items: center;
    justify-items: center;

    > img {
      height: 300px;
    }

    > div {
      text-align: center;

      > div {
        opacity: 0;
        animation-fill-mode: forwards;
        animation-name: fadeInFromBottom;
        animation-duration: 0.5s;
        animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
        margin: 20px;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .content {
      grid-template-columns: auto;
    }
  }

  .cl1 {
    font-weight: bold;
    width: 200px;
    height: 200px;
  }

  .cl2 {
    color: var(--el-color-primary);
    font-weight: bold;
    font-size: 40px;
    animation-delay: 0.1s;
  }

  .cl3 {
    font-weight: bold;
    font-size: 20px;
    animation-delay: 0.2s;
  }

  .cl4 {
    max-width: 300px;
    font-size: 13px;
    animation-delay: 0.3s;
  }
}

@keyframes fadeInFromBottom {
  0% {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
