<template>
  <div class="page-container">
    <el-card class="login-card">
      <div class="card-content">

        <!-- 左侧图片区域 -->
        <div class="left-section"></div>

        <!-- 右侧注册表单 -->
        <div class="right-section">
          <el-tabs v-model="activeTab" stretch @tab-click="handleTabChange">
            <el-tab-pane label="手机注册" name="phone"></el-tab-pane>
            <el-tab-pane label="账号注册" name="account"></el-tab-pane>
          </el-tabs>

          <el-form :model="registerForm" :rules="currentRules" ref="registerFormRef" status-icon
                   @submit.prevent="handleSubmit" class="register-form">
            <el-alert v-if="errorMessage" :title="errorMessage" type="error" class="error-alert"/>

            <!-- 手机注册表单 -->
            <template v-if="activeTab === 'phone'">
              <el-form-item prop="phone" style="margin-bottom: 30px;">
                <el-input v-model="registerForm.phone" placeholder="请输入手机号" maxlength="11">
                  <template #prefix>
                    <el-icon>
                      <Iphone/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="code" style="margin-bottom: 30px;">
                <div class="code-input" style="display: flex;">
                  <el-input v-model="registerForm.code" placeholder="请输入验证码" maxlength="4" clearable
                            style="width: 255px">
                    <template #prefix>
                      <el-icon>
                        <Message/>
                      </el-icon>
                    </template>
                  </el-input>
                  <el-button class="send-code-btn" :disabled="countdown > 0" @click="sendSMSCode">
                    {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item prop="password" style="margin-bottom: 30px;">
                <el-input
                    v-model="registerForm.password"
                    placeholder="请输入密码"
                    type="password"
                    show-password
                >
                  <template #prefix>
                    <el-icon>
                      <Lock/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </template>

            <!-- 账号注册表单 -->
            <template v-if="activeTab === 'account'">
              <el-form-item prop="username" style="margin-bottom: 30px;">
                <el-input v-model="registerForm.username" placeholder="请输入用户名">
                  <template #prefix>
                    <el-icon>
                      <User/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password" style="margin-bottom: 30px;">
                <el-input v-model="registerForm.password" placeholder="请输入密码" type="password" show-password>
                  <template #prefix>
                    <el-icon>
                      <Lock/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" native-type="submit" class="register-button">
                {{ activeTab === 'phone' ? '立即注册' : '账号注册' }}
              </el-button>
            </el-form-item>

            <div class="additional-options" style="text-align: left;">
              <router-link to="/login">
                <el-link type="primary">返回登录</el-link>
              </router-link>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
import {Iphone, Message, User, Lock} from '@element-plus/icons-vue'
import requestUtil from "@/util/request.js";

const router = useRouter()

const activeTab = ref('phone')
const registerFormRef = ref()
const countdown = ref(0)
const errorMessage = ref('')

const registerForm = ref({
  phone: '',
  code: '',
  username: '',
  password: ''
})

const registerRules = {
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
      ? {phone: registerRules.phone, code: registerRules.code, password: registerRules.password}
      : {username: registerRules.username, password: registerRules.password}
})

const handleTabChange = async () => {
  errorMessage.value = ''
  registerFormRef.value?.clearValidate()
}

const sendSMSCode = async () => {
  try {
    await registerFormRef.value.validateField('phone')
    errorMessage.value = ''
    const result = await requestUtil.post("api/users/sms", {
      phone_num: registerForm.value.phone
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
    await registerFormRef.value.validate()
    let result
    if (activeTab.value === 'phone') {
      result = await requestUtil.post("api/users/sms_register", {
        phone_num: registerForm.value.phone,
        random_num: registerForm.value.code,
        password: registerForm.value.password
      })
    } else {
      result = await requestUtil.post("api/users/register", {
        username: registerForm.value.username,
        password: registerForm.value.password
      })
    }
    ElMessage.success('注册成功');
    await router.push("/login")
  } catch (error) {
    errorMessage.value = error.response ? error.response.data : '注册失败';
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

.send-code-btn {
  width: 125px;
  height: 40px;
  flex-shrink: 0;
}

.card-content {
  display: flex;
}

.left-section {
  width: 40%;
  background-image: url("/src/assets/心灵花园登录logo.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.code-input {
  display: flex;
  gap: 10px;
}

.register-form {
  margin-top: 20px;
}

.right-section {
  flex: 1;
  padding: 30px;
}

.additional-options {
  text-align: center;
  margin-top: 15px;
}

.register-button {
  width: 100%;
  height: 40px;
  margin-top: 10px;
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
