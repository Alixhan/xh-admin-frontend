<template>
  <div class="demo-view">
    <m-form ref="formRef" :columns="columns" :model="formData">
      <template #customs1>
        <el-col :span="24">
          <el-form-item prop="link" label="链接" :rules="[{ required: true }]">
            <el-input v-model="formData.link" clearable>
              <template #prepend>https://</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </m-form>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import MForm from '@/components/form/index.vue'

const formRef = ref()

const columns = ref([
  { prop: 'nickName', label: '昵称', rules: [{ required: true }] },
  { slotName: 'customs1' },
  { prop: 'hobby', label: '爱好' }
])

const formData = ref({})

async function submit() {
  const data = await formRef.value.submit()
  console.log(data)
}
</script>
<style lang="scss" scoped>
.demo-view {
  text-align: end;
}
</style>
