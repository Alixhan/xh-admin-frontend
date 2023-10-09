<template>
  <div class="root">
    <el-card>
      <!--      <el-avatar shape="circle" :size="100" fit="cover" :src="avatar" />-->
      <!--      <el-text size="large" style="font-weight: bold">-->
      <!--        {{ systemStore.user.name }}-->
      <!--      </el-text>-->
      <m-form
        ref="formRef"
        :loading="formLoading"
        :columns="columns"
        :model="formData"
        handleType="edit"
        :colspan="24"
      ></m-form>
      <div class="m-footer">
        <el-button icon="check" type="primary" :loading="saveLoading" @click="save"> 保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="tsx" setup>
import { useSystemStore } from '@/stores/system'
import { ref } from 'vue'
import { getUserById, postSaveUser } from '@/api/system/user'

const systemStore = useSystemStore()

const formData = ref({
  ...systemStore.user,
  password2: '',
})

const columns = [
  { prop: 'code', label: '登录账号', disabled: true },
  { prop: 'name', label: '用户名', disabled: true },
  { prop: 'avatar', label: '头像', type: 'upload-img', single: 'object' },
  { prop: 'telephone', label: '手机号码', rules: { type: 'phone' } },
  {
    prop: 'password',
    label: '新密码',
    type: 'password',
    autocomplete: 'new-password',
    placeholder: '如需修改密码请填入新密码',
  },
  {
    prop: 'password2',
    label: '重复新密码',
    placeholder: '重复新密码',
    type: 'password',
    rules: [
      {
        validator: (rule, val, callback) => {
          if (formData.value.password && formData.value.password !== val) {
            return callback(new Error('两次密码输入不一致！'))
          }
          callback()
        },
      },
    ],
  },
]

const formLoading = ref(true)
const saveLoading = ref(false)
const formRef = ref()

getUserById(systemStore.user.id).then((res) => {
  formData.value = res.data
  formData.value.password = ''
  formLoading.value = false
})

function save() {
  formRef.value.submit().then(() => {
    postSaveUser(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: '保存成功',
    }).then((res) => {
      systemStore.user.avatar = res.data.avatar
    })
  })
}
</script>
<style lang="scss" scoped>
.root {
}
</style>
