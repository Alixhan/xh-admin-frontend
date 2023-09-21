<template>
  <div class="icp-view">
    <div class="icp">
      <el-link href="http://beian.miit.gov.cn/" :underline="false"> {{ icpCode }}</el-link>
      <el-link v-if="psbCode" href="http://beian.miit.gov.cn/" :underline="false" style="margin-left: 10px;">
        <img src="@/assets/image/jinghui.png" style="float: left; width: 1.2em; height: 1.2em; margin: 0 5px" alt="" />
        {{ psbCode }}
      </el-link>
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
    font-size: 12px;
    padding: 2px 10px;
    margin: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
