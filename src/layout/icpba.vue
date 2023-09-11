<template>
  <div class="icp-view">
    <div class="icp">
      <a href="http://beian.miit.gov.cn/" style="text-decoration: none" target="_blank">皖 ICP 备 {{ icpCode }} 号</a>
      <a
        target="_blank"
        :href="`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${psbCode}`"
        style="display: inline-flex; align-items: center; text-decoration: none"
      >
        <img src="@/assets/image/jinghui.png" style="float: left; width: 1em; height: 1em; margin: 0 5px" alt="" />
        皖公网安备 {{psbCode}} 号
      </a>
    </div>
  </div>
</template>

<script setup>
//icp备案号
const icpCode = 'XXXXXXXXX'
//公安备案号
const psbCode = 'XXXXXXXXX'
</script>

<style scoped lang="scss">
.icp-view {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;

  .icp {
    border-radius: 3px;
    font-size: 10px;
    color: #0e0e0e;
    padding: 2px 10px;
    margin: 0 10px;
    background-color: rgba(255, 255, 255, 0.3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
