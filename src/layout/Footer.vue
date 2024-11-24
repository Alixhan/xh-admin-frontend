<template>
  <div class="footer-view">
    <div class="footer">
      <el-text>Released under the Apache License 2.0</el-text>
      <el-text>Copyright © 2023-present sxh</el-text>
      <el-text class="hover-view" @click="windowOpen('https://beian.miit.gov.cn/')">{{ icpCode }}</el-text>
      <el-text
        class="hover-view"
        @click="windowOpen(`https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${psbCode}`)"
      >
        <img src="@/assets/image/jinghui.png" style="width: 1.2em; margin-right: 5px" alt="" />
        {{ icpCode.substring(0, 1) }}公网安备{{ psbCode }}号
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LayoutFooter'
})

//icp备案号
const icpCode = '皖ICP备2023021987号-1'
//公安备案号
const psbCode = '34180202000574'

function windowOpen(url) {
  globalThis.open(url)
}
</script>

<style scoped lang="scss">
:deep(.el-text) {
  font-size: 12px;
}

.footer-view {
  text-align: center;
  font-size: 12px;

  .footer {
    border-radius: 3px;
    margin: 0 10px;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    grid-column-gap: 15px;
    grid-row-gap: 5px;
  }
}

.hover-view {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
