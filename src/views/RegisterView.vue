<template>
    <div class="register-view">
      <h1>欢迎您来到心灵花园</h1>
      <!-- 在这里使用 Register 组件 -->
      <Register />
    </div>
  </template>
  
  <script setup>
  // 导入 Register 组件
  import Register from '@/components/Register.vue';
  </script>
  
  <style scoped>
  .register-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: #f0f8ff;
    min-height: 100vh;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  </style>