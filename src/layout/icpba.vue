<template>
  <div class="icp-view">
    <div class="icp">
      <el-link @click="windowOpen('https://beian.miit.gov.cn/')" :underline="false"> {{ icpCode }} </el-link>
      <el-link
        v-if="psbCode"
        @click="windowOpen(`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${psbCode}`)"
        :underline="false"
        style="margin-left: 10px"
      >
        <img src="@/assets/image/jinghui.png" style="float: left; width: 1.2em; height: 1.2em; margin: 0 5px" alt="" />
        {{ icpCode.substring(0, 1) }}公网安备 {{ psbCode }} 号
      </el-link>
    </div>
  </div>
</template>

<script setup>
//icp备案号
const icpCode = '皖ICP备2023021987号-1'
//公安备案号
const psbCode = 'XXXXXXXXXX'

function windowOpen(url) {
  window.open(url)
}
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
    font-size: 12px;
    padding: 2px 10px;
    margin: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
