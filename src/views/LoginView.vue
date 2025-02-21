<template>
  <div class="page-container">
    <el-card class="login-card">
      <div class="card-content">
        <!-- 左侧图片区域 -->
        <div class="left-section"></div>

        <!-- 右侧登录表单 -->
        <div class="right-section">
          <el-tabs v-model="activeTab" stretch @tab-click="handleTabChange">
            <el-tab-pane label="手机登录" name="phone"></el-tab-pane>
            <el-tab-pane label="账号登录" name="account"></el-tab-pane>
          </el-tabs>

          <el-form :model="loginForm" :rules="currentRules" ref="loginFormRef" status-icon
                   @submit.prevent="handleSubmit" class="login-form">
            <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon class="error-alert"/>

            <!-- 手机登录表单 -->
            <template v-if="activeTab === 'phone'">
              <el-form-item prop="phone" style="margin-bottom: 30px;">
                <el-input v-model="loginForm.phone" placeholder="请输入手机号" :maxlength="11" clearable>
                  <template #prefix>
                    <el-icon>
                      <Iphone/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="code" style="margin-bottom: 30px;">
                <div class="code-input" style="display: flex;">
                  <el-input v-model="loginForm.code" placeholder="请输入验证码" :maxlength="4" clearable
                            style="width: 255px">
                    <template #prefix>
                      <el-icon>
                        <Message/>
                      </el-icon>
                    </template>
                  </el-input>
                  <el-button class="send-code-btn" :disabled="countdown > 0" @click="sendSMSCode"
                             style="width: 125px">
                    {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>
            </template>

            <!-- 账号登录表单 -->
            <template v-if="activeTab === 'account'">
              <el-form-item prop="username" style="margin-bottom: 30px;">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                  <template #prefix>
                    <el-icon>
                      <User/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password" style="margin-bottom: 30px;">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password clearable>
                  <template #prefix>
                    <el-icon>
                      <Lock/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </template>

            <el-form-item>
              <el-button native-type="submit" type="primary" class="login-button">
                {{ activeTab === 'phone' ? '立即登录' : '账号登录' }}
              </el-button>
            </el-form-item>

            <div class="additional-options" style="text-align: left;">
              <router-link to="/register">
                <el-link type="primary">立即注册</el-link>
              </router-link>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import {useRouter} from 'vue-router'
import requestUtil from '@/util/request'
import {
  Iphone,
  Message,
  User,
  Lock
} from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref()
const activeTab = ref('phone')
const countdown = ref(0)
const errorMessage = ref('')

const loginForm = ref({
  phone: '',
  code: '',
  username: '',
  password: ''
})

const loginRules = {
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur'}
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'}
  ],
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'}
  ]
}

const currentRules = computed(() => {
  return activeTab.value === 'phone'
      ? {phone: loginRules.phone, code: loginRules.code}
      : {username: loginRules.username, password: loginRules.password}
})

const handleTabChange = () => {
  errorMessage.value = ''
  loginFormRef.value?.clearValidate()
}

const sendSMSCode = async () => {
  try {
    await loginFormRef.value.validateField('phone')
    errorMessage.value = ''
    const result = await requestUtil.post("api/users/sms", {
      phone_num: loginForm.value.phone
    })
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0)
        clearInterval(timer)
    }, 1000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '发送验证码失败'
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await loginFormRef.value.validate()
    let result
    if (activeTab.value === 'phone') {
      result = await requestUtil.post("api/users/sms_login", {
        phone_num: loginForm.value.phone,
        random_num: loginForm.value.code
      })
    } else {
      result = await requestUtil.post("api/users/login", {
        identifier: loginForm.value.username,
        password: loginForm.value.password
      })
    }

    if (result.data.token) {
      window.sessionStorage.setItem('token', result.data.token)
    }
    if (result.data.user) {
      window.sessionStorage.setItem('user', JSON.stringify(result.data.user))
    }
    router.push('/Home')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '登录失败，请检查输入'
  }
}
</script>

<style scoped>

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 98vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

.login-card {
  width: 800px;
  border-radius: 12px;
  overflow: hidden;
}

.card-content {
  display: flex;
}

.left-section {
  width: 40%;
  background-image: url("/src/assets/心灵花园登录logo.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.right-section {
  flex: 1;
  padding: 30px;
}

.login-form {
  margin-top: 20px;
}

.code-input {
  display: flex;
  gap: 10px;
}

.send-code-btn {
  height: 40px;
  flex-shrink: 0;
}

.login-button {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

.additional-options {
  text-align: center;
  margin-top: 15px;
}

.error-alert {
  margin-bottom: 20px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e4e7ed;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  padding: 0 20px;
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-icon) {
  font-size: 16px;
}
</style>