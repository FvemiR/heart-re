<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="site-title">心灵花园</h1>
        
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
    </nav>

    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const navItems = ref([
  {name:'首页',path:'/Home'},
  { name: '心理健康测试', path: '/mental-test' },
  { name: '心理社区活动', path: '/community' },
  { name: '心理健康知识科普', path: '/knowledge' },
  { name: 'AI心理辅导咨询', path: '/ai-counseling' },
  { name: '心情日记', path: '/mood-diary' }
]);
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f0f8ff; /* 新增柔和背景色 */
  min-height: 100vh;
  padding-top: 40px; /* 防止内容被固定导航栏遮挡 */
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.site-title {
  font-size: 3rem; 
  color: #2c3e50;
  margin: 0;
  margin-right: auto; /* 强制左对齐 */
  font-family: 'Georgia', serif;
  font-weight: bold;
  
}

/* 其余样式保持不变 */
.nav-list {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: color 0.3s, background-color 0.3s;
  border-radius: 4px;
}

.nav-item a:hover {
  color: #3498db;
  background-color: #f0f8ff;
}

.active-link {
  color: #3498db !important;
  border-bottom: 2px solid #3498db;
}

.auth-buttons {
  display: flex;
  gap: 1.5rem;
}

.login-btn, .register-btn {
  text-decoration: none;
  color: #ffffff;
  background-color: #3498db;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.login-btn:hover, .register-btn:hover {
  background-color: #2980b9;
}
</style>