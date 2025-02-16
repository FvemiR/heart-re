<template>
  <div class="page-container">
    <AI @close="handleClose"/>
    <!-- 页面具体内容 -->
  </div>
</template>

<script setup lang="ts">
import AI from '@/components/AI.vue';

const handleClose = () => {
  // 处理关闭事件
  console.log('AI dialog closed');
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

/* 可以在这里添加更多全局样式 */
</style>