<template>
  <div class="page-container">
    <div class="login-card">
      <!-- 左侧图片区域 -->
      <div class="left-section"></div>

      <!-- 右侧登录表单 -->
      <div class="right-section">
        <div class="tab-switch">
          <button 
            :class="['tab-button', { 'active': activeTab === 'phone' }]"
            @click="activeTab = 'phone'"
          >
            手机登录
          </button>
          <button
            :class="['tab-button', { 'active': activeTab === 'account' }]"
            @click="activeTab = 'account'"
          >
            账号登录
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- 错误信息展示 -->
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

          <!-- 手机登录表单 -->
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
          </div>

          <!-- 账号登录表单 -->
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
          </div>

          <button type="submit" class="login-button">
            {{ activeTab === 'phone' ? '立即登录' : '账号登录' }}
          </button>

          <div class="additional-options">
            <router-link to="/register">立即注册</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import requestUtil from '@/util/request'
import qs from 'qs'

const router = useRouter()

const activeTab = ref('phone')
const phone = ref('')
const code = ref('')
const username = ref('')
const password = ref('')
const countdown = ref(0)
const errorMessage = ref('')

const sendSMSCode = async () => {
  if (!phone.value.match(/^1[3-9]\d{9}$/)) {
    errorMessage.value = '请输入有效的手机号码'
    return
  }

  errorMessage.value = ''
  try {
    await requestUtil.post(`/api/users/sms?${qs.stringify({ phone_num: phone.value })}`)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '发送验证码失败'
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  try {
    let result
    if (activeTab.value === 'phone') {
      if (!phone.value.match(/^1[3-9]\d{9}$/)) {
        errorMessage.value = '请输入有效的手机号码'
        return
      }
      if (!code.value) {
        errorMessage.value = '请输入验证码'
        return
      }
      result = await requestUtil.post(`api/users/sms_login?${qs.stringify({
        phone_num: phone.value,
        random_num: code.value
      })}`)
    } else {
      if (!username.value) {
        errorMessage.value = '请输入用户名'
        return
      }
      if (!password.value) {
        errorMessage.value = '请输入密码'
        return
      }
      result = await requestUtil.post(`api/users/login?${qs.stringify({
        username: username.value,
        password: password.value
      })}`)
    }
    
    // 存储token
    if (result.data.token) {
      window.sessionStorage.setItem('token', result.data.token)
    }
    router.push('/Home')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '登录失败，请检查输入'
  }
}
</script>

<style scoped>
/* 样式部分保持不变 */
.page-container {
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  background-color: #ffffff;
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
  width: 65%;
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