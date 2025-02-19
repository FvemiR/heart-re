<template>
  <div class="page-container">
    <div class="login-card">
      <!-- 左侧图片区域 -->
      <div class="left-section"></div>

      <!-- 右侧注册表单 -->
      <div class="right-section">
        <div class="tab-switch">
          <button 
            :class="['tab-button', { 'active': activeTab === 'phone' }]"
            @click="activeTab = 'phone'"
          >
            手机注册
          </button>
          <button
            :class="['tab-button', { 'active': activeTab === 'account' }]"
            @click="activeTab = 'account'"
          >
            账号注册
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 错误信息展示 -->
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

          <!-- 手机注册表单 -->
          <div v-if="activeTab === 'phone'">
            <div class="form-group">
              <label for="phone">手机号码</label>
              <input
                type="tel"
                id="phone"
                v-model="phone"
                placeholder="请输入手机号"
                pattern="[0-9]{11}"
              />
            </div>
            <div class="form-group">
              <label for="code">验证码</label>
              <div class="code-input">
                <input
                  type="text"
                  id="code"
                  v-model="code"
                  placeholder="请输入验证码"
                />
                <button 
                  type="button" 
                  class="send-code-btn"
                  :disabled="countdown > 0"
                  @click="sendSMSCode"
                >
                  {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <!-- 账号注册表单 -->
          <div v-if="activeTab === 'account'">
            <div class="form-group">
              <label for="username">用户名</label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="请输入用户名"
              />
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="请输入密码"
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">确认密码</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="请再次输入密码"
              />
            </div>
          </div>

          <button type="submit" class="login-button" @click="handleRegister">
            {{ activeTab === 'phone' ? '立即注册' : '账号注册' }}
          </button>

          <div class="additional-options">
            <router-link to="/login">返回登录</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('phone') // 默认显示手机注册
const phone = ref('')
const code = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const countdown = ref(0)
const errorMessage = ref('')

const sendSMSCode = () => {
  // 发送验证码逻辑
  if (!phone.value.match(/^1[3-9]\d{9}$/)) {
    errorMessage.value = '请输入有效的手机号码'
    return
  }
  
  errorMessage.value = ''
  // 开始倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSubmit = () => {
  errorMessage.value = ''

  if (activeTab.value === 'phone') {
    if (!phone.value.match(/^1[3-9]\d{9}$/)) {
      errorMessage.value = '请输入有效的手机号码'
      return
    }
    if (!code.value) {
      errorMessage.value = '请输入验证码'
      return
    }
    if (!password.value) {
      errorMessage.value = '请输入密码'
      return
    }

    console.log('手机注册:', {
      phone: phone.value,
      code: code.value,
      password: password.value
    })
  } else {
    if (!username.value) {
      errorMessage.value = '请输入用户名'
      return
    }
    if (!password.value) {
      errorMessage.value = '请输入密码'
      return
    }
    if (password.value !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    console.log('账号注册:', {
      username: username.value,
      password: password.value
    })
  }
}

const handleRegister = () => {
  handleSubmit()
  if (!errorMessage.value) {
    router.push('/Home')
  }
}
</script>

<style scoped>
.page-container {
  background-color: #f8f9fa; /* 更浅的白色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  background-color: #ffffff; /* 白色卡片背景 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 800px;
  max-width: 90vw;
  overflow: hidden;
}

.left-section {
  width: 40%;
  background-image: url("../src/assets/心灵花园登录logo.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.right-section {
  padding: 40px;
  flex: 1;
}

.tab-switch {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1.1rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 65%; /* 输入框宽度调窄 */
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #6366f1;
}

.code-input {
  display: flex;
  gap: 1rem;
}

.code-input input {
  flex: 1;
}

.send-code-btn {
  padding: 0 1rem;
  background: #e0e7ff;
  color: #6366f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.send-code-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #4f46e5;
}

.additional-options {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.additional-options a {
  text-decoration: none;
  color: #6366f1;
  transition: color 0.3s ease;
}

.additional-options a:hover {
  color: #4f46e5;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
}
</style>



