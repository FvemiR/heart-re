<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <el-menu
      :default-active="$route.path"
      class="navbar el-menu-demo"
      mode="horizontal"
      background-color="#ffffff"
      text-color="#333333"
      active-text-color="#409EFF"
      router
    >
      <!-- Logo -->
      <div class="logo-title">
        <img src="../assets/心灵花园左上角logo.png" alt="Logo" class="nav-logo">
      </div>

      <!-- 导航项 -->
      <el-menu-item v-for="(item, index) in navItems" 
                    :key="index" 
                    :index="item.path">
        {{ item.name }}
      </el-menu-item>

      <!-- 头像 -->
      <div class="avatar-container">
        <el-avatar :size="40" :src="avatarUrl" @click="handleAvatarClick"></el-avatar>
      </div>
    </el-menu>

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
import { useRouter } from 'vue-router';
import AI from '../components/AI.vue';
import { ElMenu, ElMenuItem, ElAvatar } from 'element-plus';

// 初始化 router
const router = useRouter();

// 控制AI对话框显示状态
const showAIChat = ref(false);
const toggleAIChat = () => {
  showAIChat.value = !showAIChat.value;
};

// 导航项数据
const navItems = ref([
  { name: '首页', path: '/Home' },
  { name: '心理健康测试', path: '/mental-test' },
  { name: '心理社区活动', path: '/community' },
  { name: '心理健康知识科普', path: '/knowledge' },
  { name: 'AI心理辅导咨询', path: '/ai-counseling' },
  { name: '心情日记', path: '/mood-diary' }
]);

// 头像URL
const avatarUrl = ref('https://img.alicdn.com/tfs/TB1CYgmNpXXXXc6XVXXXXXXXXXX-50-50.png');

// 头像点击事件处理函数
const handleAvatarClick = () => {
  console.log('Avatar clicked!');
  // 使用编程式导航跳转到用户信息页面
  router.push({ name: 'UserInfo' });
};
</script>

<style scoped>
.container {
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #f0f2f5; /* 更浅的背景色 */
  min-height: 100vh;
  padding-top: 60px; /* 防止内容被固定导航栏遮挡 */
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #ffffff; /* 白色背景 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo-title {
  display: flex;
  align-items: center;
}

.nav-logo {
  width: 160px;
  height: 40px;
}

.avatar-container {
  margin-right: 20px;
  cursor: pointer;
}

/* AI客服样式 */
.ai-float-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #409EFF;
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
  background: #3a8ee6;
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