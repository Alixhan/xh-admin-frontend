<template>
  <div class="el-text demo-view">
    <el-input
      v-for="item in ruleObject"
      :key="item.prop"
      class="item1"
      :placeholder="item.label"
      v-model="formData[item.prop]"
    >
      <template #prepend>
        {{ item.label }}
      </template>
    </el-input>
    <el-button class="item1" @click="doValid" type="primary">验证</el-button>
    <div>验证结果：{{ JSON.stringify(result) }}</div>
  </div>
</template>
<script setup>
import validate from '@/utils/validate'
import { ref } from 'vue'

const formData = ref({
  mc: '',
  email: 'sdff@gmail.com',
  birthday: ''
})

const ruleObject = ref([
  { prop: 'mc', label: '名称', rules: [{ required: true, maxlength: 10 }] },
  { prop: 'email', label: '邮箱', rules: [{ type: 'email' }] },
  { prop: 'birthday', label: '生日', rules: [{ dateFormat: 'YYYY-MM-DD' }] }
])

const result = ref()

async function doValid() {
  result.value = await validate(formData.value, ruleObject.value)
}
</script>
<style scoped>
.demo-view {
  display: flex;
  flex-direction: column;
  gap: 10px;

  > .item1 {
    max-width: 400px;
  }
}
</style>
