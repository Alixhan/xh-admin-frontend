<template>
  <div class="icp-view">
    <div class="icp">
      <el-link href="http://beian.miit.gov.cn/" :underline="false"> 皖 ICP 备 {{ icpCode }} 号 </el-link>
      <el-link href="http://beian.miit.gov.cn/" :underline="false">
        <img src="@/assets/image/jinghui.png" style="float: left; width: 1.2em; height: 1.2em; margin: 0 5px" alt="" />
        皖公网安备 {{ psbCode }} 号
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
    padding: 2px 5px;
    margin: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
