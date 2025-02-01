<template>
  <div class="page-container">
    <h2 class="title">心理日记</h2>
    <!-- 引入情绪日记组件 -->
    <EmotionJournal />
  </div>
</template>

<script setup>
// 引入情绪日记组件
import EmotionJournal from '../components/EmotionJournal.vue';
</script>

<style scoped>
.page-container h2{
  font-family: "KaiTi", "STKaiti", serif;
  font-size:70px;
}
.page-container {
  margin-top: 30px;
  max-width: 1200px;
  margin: 100px auto;
  padding: 20px;
}
</style>