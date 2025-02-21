<template>
  <div class="emotion-journal">
    <el-card shadow="never" class="header-card">
      <h2>情绪日记</h2>
      <p class="description">记录你的每日情绪，帮助自己更好地理解和管理情绪。</p>
    </el-card>

    <el-divider></el-divider>

    <el-form :model="form" @submit.prevent="submitJournal" label-position="top">
      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="日记标题">
        <el-input v-model="form.emotion" placeholder="今天心情如何?" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="日记内容">
        <el-input v-model="form.content" type="textarea" rows="6" style="width: 100%;" />
      </el-form-item>
      <el-button type="primary" native-type="submit" icon="el-icon-check">保存记录</el-button>
    </el-form>

    <el-divider></el-divider>

    <div class="journal-list">
      <h3>历史记录</h3>
      <el-timeline>
        <el-timeline-item v-for="(item, index) in journals" :key="index" :color="getEmotionColor(item.emotion)">
          <el-card shadow="hover" class="journal-item">
            <div class="date">{{ formatDate(item.date) }}</div>
            <div class="emotion-tag">
              <el-tag :type="getEmotionType(item.emotion)">{{ item.emotion }}</el-tag>
            </div>
            <div class="content">{{ item.content }}</div>
            <el-button type="danger" @click="deleteJournal(index)" icon="el-icon-delete">删除</el-button>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const journals = ref([]);
const form = reactive({
  date: new Date(),
  emotion: '',
  content: ''
});

const submitJournal = () => {
  if (!form.emotion || !form.content) {
    ElMessage.warning('请填写完整信息');
    return;
  }
  journals.value.push({ ...form });
  form.emotion = '';
  form.content = '';
  ElMessage.success('记录已保存');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getEmotionType = (emotion) => {
  const types = { happy: 'success', calm: 'info', anxious: 'warning', sad: 'danger' };
  return types[emotion] || '';
};

const getEmotionColor = (emotion) => {
  const colors = { happy: '#67C23A', calm: '#409EFF', anxious: '#E6A23C', sad: '#F56C6C' };
  return colors[emotion] || '#909399';
};

const deleteJournal = (index) => {
  journals.value.splice(index, 1);
  ElMessage.success('记录已删除');
};
</script>

<style scoped>
.emotion-journal {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-card {
  text-align: center;
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.journal-list {
  margin-top: 20px;
}

.journal-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.emotion-tag {
  margin: 10px 0;
}

.date {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}

.content {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.el-button {
  margin-top: 10px;
}
</style>



