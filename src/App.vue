<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <!-- 左侧：网站标题 -->
        <h1 class="site-title">心灵花园</h1>
        
        <!-- 右侧：导航栏功能 -->
        <div class="nav-right">
          <ul class="nav-list">
            <li v-for="(item, index) in navItems" 
                :key="index" 
                class="nav-item">
              <router-link 
                :to="item.path" 
                active-class="active-link"
                exact-active-class="exact-active">
                {{ item.name }}
              </router-link>
            </li>
          </ul>

          <div class="auth-buttons">
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 路由出口 -->
    <router-view></router-view>

    <!-- AI客服入口 -->
    <div class="ai-float-btn" @click="toggleAIChat">
      <span>AI客服</span>
    </div>

    <!-- AI对话框 -->
    <div v-if="showAIChat" class="ai-chat-container">
      <AI @close="toggleAIChat"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AI from '../src/components/AI.vue';

const showAIChat = ref(false);
const toggleAIChat = () => {
  showAIChat.value = !showAIChat.value;
};

const navItems = ref([
  { name: '首页', path: '/Home' },
  { name: '心理健康测试', path: '/mental-test' },
  { name: '心理社区', path: '/community' },
  { name: '心理健康知识科普', path: '/knowledge' },
  { name: 'AI心理辅导咨询', path: '/ai-counseling' },
  { name: '心情日记', path: '/mood-diary' }
]);
</script>

<style scoped>
.container {
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #ffffff; /* 更浅的背景色 */
  min-height: 100vh;
  padding-top: 60px; /* 防止内容被固定导航栏遮挡 */
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 4%;
  background-color: #2f0491; /* 白色背景 */
  padding: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 左侧：网站标题 */
.site-title {
  font-size: 2rem; /* 调整标题大小 */
  color: #ffffff; /* 深灰色文字 */
  margin: 0;
  font-family: 'Georgia', serif;
  font-weight: bold;
}

/* 右侧：导航栏功能 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8rem; /* 调整间距 */
}

.nav-list {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item a {
  text-decoration: none;
  color: #ffffff; /* 深灰色文字 */
  padding: 0.5rem 0.8rem;
  transition: color 0.3s, background-color 0.3s;
  border-radius: 4px;
}

.nav-item a:hover {
  color: #007bff; /* 悬停时文字颜色 */
  background-color: rgba(0, 123, 255, 0.1); /* 悬停时背景色 */
}

.active-link {
  color: #007bff !important; /* 激活状态文字颜色 */
  border-bottom: 2px solid #007bff; /* 激活状态底部边框 */
}

/* 登录/注册按钮 */
.auth-buttons {
  display: flex;
  gap: 1rem;
}

.login-btn, .register-btn {
  text-decoration: none;
  color: #ffffff; /* 白色文字 */
  background-color: #007bff; /* 蓝色背景 */
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.login-btn:hover, .register-btn:hover {
  background-color: #0056b3; /* 悬停时背景色 */
}

/* AI客服样式 */
.ai-float-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1001;
}

.ai-float-btn:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.ai-float-btn span {
  font-size: 14px;
  font-weight: 600;
}

.ai-chat-container {
  position: fixed;
  bottom: 120px;
  right: 40px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}
</style>



