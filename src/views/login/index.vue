<template>
  <el-scrollbar height="100%" class="login-root">
    <div class="image-bg" />
    <div
      class="login-view"
      :class="{
        'width-layout-shrink': systemStore.layout.windowWidth < 500,
      }"
    >
      <SwitchStyle class="switch-style" />
      <div class="title-system">{{ title }}</div>
      <div class="card-view">
        <div class="title-view">用户登录</div>
        <el-form @keyup.enter="submit" ref="formRef" :rules="rules" size="large" :model="formData">
          <el-form-item prop="username">
            <el-input
              ref="usernameRef"
              type="text"
              clearable
              v-model="formData.username"
              placeholder="请输入账号"
              prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="passwordRef"
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
              prefix-icon="Unlock"
            />
          </el-form-item>
          <el-form-item v-if="false" prop="captcha">
            <el-row class="w100" :gutter="15">
              <el-col :span="16">
                <el-input
                  ref="captchaRef"
                  type="text"
                  placeholder="请输入图形验证码"
                  v-model="formData.captcha"
                  clearable
                  autocomplete="off"
                  prefix-icon="Unlock"
                />
              </el-col>
              <el-col :span="8">
                <img @click="refresh" class="captcha-img" :src="verificationUrl" alt="" />
              </el-col>
            </el-row>
          </el-form-item>
          <div class="forget-password-view">
            <el-link type="primary" icon="QuestionFilled"> 忘记密码</el-link>
          </div>
          <el-button :loading="loading" class="submit-button" round type="primary" size="large" @click="submit">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
    <icpba />
  </el-scrollbar>
</template>
<script setup>
import { defineOptions, nextTick, reactive, ref } from 'vue'
import { userLogin } from '@/api/system/user'
import { useSystemStore } from '@/stores/system'
import { useRouter } from 'vue-router'
import SwitchStyle from '@/layout/default/action/switchStyle.vue'
import Icpba from '@/layout/icpba.vue'

defineOptions({
  name: 'SystemLogin',
})

const title = import.meta.env.VITE_TITLE

const systemStore = useSystemStore()
const router = useRouter()

const loading = ref(false)
const verificationUrl = ref('')
const formData = reactive({
  username: '',
  password: '',
  captcha: '',
})
const rules = reactive({
  username: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入图形验证码' }],
})

const formRef = ref()

function refresh() {}

function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      systemStore.setToken('')
      userLogin(formData, {
        loadingRef: loading, // vue3中的ref,可以动态更新此值
        showSuccessMsg: true,
        successMsg: (res) => '登录成功！欢迎你，尊敬的' + res.data.user.name, // 成功的提示信息
        errorMsg: '登录失败', // 失败的提示信息
      }).then((res) => {
        const data = res.data
        systemStore.setLoginUserInfo(data)
        const firstRoute = systemStore.getFirstRoute()
        nextTick(() => router.replace(firstRoute.fullPath))
      })
    }
  })
}
</script>
<style scoped lang="scss">
.login-root {
  //background: url('@/assets/bg.jpg') no-repeat;
  .image-bg {
    position: fixed;
    width: 90%;
    height: 90%;
    background-image: linear-gradient(-45deg, #bd34fe 50%, #1babe0 50%);
    filter: blur(200px);
    top: 5%;
    left: 5%;
  }
}

.login-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .switch-style {
    align-self: end;
    margin-top: 20px;
    margin-right: 20px;
  }

  .title-system{
    font-size: 50px;
    font-weight: bold;
    color: white;
    z-index: 1;
    font-family: 华文行楷;
    position: fixed;
    text-align: center;
    left: 15%;
    top: 20%;
  }

  .card-view {
    border-radius: var(--el-border-radius-base);
    //box-shadow: var(--el-box-shadow);
    opacity: 0.9;
    padding: 20px;
    position: fixed;
    background-color: var(--layout-left-bg-color);
    width: 350px;
    top: 30%;
    left: 15%;

    .title-view {
      color: var(--el-color-primary);
      text-align: center;
      font-size: 1.5em;
      margin-top: 10px;
      margin-bottom: 50px;
    }

    .forget-password-view {
      font-size: 10px;
      text-align: right;
      margin-bottom: 20px;
    }

    .submit-button {
      width: 100%;
    }
  }
}

.width-layout-shrink {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  .card-view {
    background-color: inherit;
    margin-top: 20px;
    position: relative;
    inset: auto;
    width: auto;
  }

  .title-system{
    position: relative;
    text-align: center;
    inset: auto;
    margin: 20px 0;
  }
}
</style>
