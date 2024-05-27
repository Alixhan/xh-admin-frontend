<template>
  <el-scrollbar
    height="100%"
    class="login-root"
    :class="{
      dark: systemStore.layout.isDark
    }"
  >
    <div class="image-bg" />
    <div class="login-view">
      <div class="action-view">
        <SwitchLocale />
        <SwitchStyle />
      </div>
      <div class="card-view">
        <div class="title-system">{{ title }}</div>
        <el-form class="form-view" @keyup.enter="submit" ref="formRef" :rules="rules" size="large" :model="formData">
          <el-form-item prop="username">
            <el-input
              type="text"
              clearable
              v-model="formData.username"
              :placeholder="$t('login.account')"
              prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              :placeholder="$t('login.password')"
              show-password
              clearable
              prefix-icon="Unlock"
            />
          </el-form-item>
          <el-form-item prop="captchaCode">
            <div style="display: inline-flex; width: 100%">
              <el-input
                v-model="formData.captchaCode"
                :placeholder="$t('login.captcha')"
                clearable
                :prefix-icon="captchaIcon"
              >
              </el-input>
              <img @click="refresh" class="captcha-img" :src="verificationUrl" alt="" />
            </div>
          </el-form-item>
          <!--          <div class="forget-password-view">-->
          <!--            <el-link type="primary" icon="QuestionFilled"> 忘记密码</el-link>-->
          <!--          </div>-->
          <el-button :loading="loading" class="submit-button" round type="primary" size="large" @click="submit">
            {{ $t('login.login') }}
          </el-button>
        </el-form>
        <div style="margin-top: 1em; text-align: right">
          <el-button :loading="loading" class="submit-button" type="primary" size="small" @click="demoLogin">
            演示账号登录
          </el-button>
        </div>
      </div>
      <Footer class="footer" />
    </div>
  </el-scrollbar>
</template>
<script setup>
import { computed, createVNode, defineOptions, nextTick, reactive, ref } from 'vue'
import { getImageCaptcha, userLogin } from '@/api/system/user'
import { useSystemStore } from '@/stores/system'
import { useRouter } from 'vue-router'
import SwitchStyle from '@/layout/default/action/switchStyle.vue'
import { v4 as uuidv4 } from 'uuid'
import MIcon from '@/components/Icon.vue'
import SwitchLocale from '@/layout/default/action/switchLocale.vue'
import Footer from '@/layout/footer.vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'SystemLogin'
})

const { t } = useI18n()

const title = import.meta.env.VITE_TITLE
const systemStore = useSystemStore()
const router = useRouter()

const captchaKey = uuidv4().replaceAll('-', '')

const loading = ref(false)
const formData = reactive({
  captchaKey,
  username: '',
  password: '',
  captchaCode: ''
})

const captchaIcon = createVNode(MIcon, { modelValue: 'local|/src/assets/icon/captcha.svg' })

//图形验证码
const verificationUrl = ref()

const rules = computed(() => ({
  username: [{ required: true, message: t('login.captcha') }],
  password: [{ required: true, message: t('login.captcha') }],
  captchaCode: [{ required: true, message: t('login.captcha') }]
}))

const formRef = ref()

refresh()

function refresh() {
  getImageCaptcha(captchaKey).then((res) => {
    verificationUrl.value = res.data.imageBase64
  })
}

function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      systemStore.setToken('')
      userLogin(
        {
          ...formData
        },
        {
          loadingRef: loading, // vue3中的ref,可以动态更新此值
          showSuccessMsg: true,
          successMsg: (res) => '登录成功！欢迎你，尊敬的' + res.data.user.name, // 成功的提示信息
          errorMsg: '登录失败' // 失败的提示信息
        }
      ).then((res) => {
        const data = res.data
        systemStore.setLoginUserInfo(data)
        const firstRoute = systemStore.getFirstRoute()
        nextTick(() => router.replace(firstRoute.fullPath))
      })
    }
  })
}

function demoLogin() {
  formData.username = 'admin'
  formData.password = 'admin123'
  if (!loading.value) submit()
}
</script>
<style scoped lang="scss">
.login-root {
  height: 100%;

  .image-bg {
    position: fixed;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
  }
}

.login-view {
  position: relative;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .action-view {
    align-self: end;
    margin-top: 20px;
    margin-right: 20px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .title-system {
    font-size: 30px;
    font-weight: bold;
    color: white;
    z-index: 1;
    text-align: center;
    margin: 30px 0 40px 0;
  }

  .card-view {
    z-index: 5;
    border-radius: 10px;
    //box-shadow: var(--el-box-shadow);
    padding: 20px;
    position: relative;
    width: min(350px, 80%);
    background: rgba(0, 0, 0, 0.2);
    margin-top: 12%;

    .form-view {
      .forget-password-view {
        font-size: 10px;
        text-align: right;
        margin-bottom: 20px;
      }

      :deep(.el-input-group__append) {
        padding: 4px;
      }

      .captcha-img {
        margin: 2px 0 2px 5px;
        width: 100px;
        height: auto;
        cursor: pointer;
        border-radius: 5px;
      }

      .submit-button {
        width: 100%;
      }
    }
  }
}

.dark {
  .image-bg {
    opacity: 0.4;
  }

  .login-view {
    .card-view {
      background: rgba(0, 0, 0, 0.5);
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
}

.footer {
  z-index: 1;
  position: absolute;
  bottom: 0;
}
</style>
