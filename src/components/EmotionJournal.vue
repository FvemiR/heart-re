<template>
  <div class="emotion-journal">
    <h2>情绪日记</h2>
    <p class="description">记录你的每日情绪，帮助自己更好地理解和管理情绪。</p>

    <el-divider></el-divider>

    <el-form :model="form" @submit.prevent="submitJournal">
      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="当前情绪">
        <el-select v-model="form.emotion" placeholder="请选择情绪">
          <el-option label="开心" value="happy" />
          <el-option label="平静" value="calm" />
          <el-option label="焦虑" value="anxious" />
          <el-option label="悲伤" value="sad" />
        </el-select>
      </el-form-item>
      <el-form-item label="日记内容">
        <el-input v-model="form.content" type="textarea" rows="4" />
      </el-form-item>
      <el-button type="primary" native-type="submit" icon="el-icon-check">保存记录</el-button>
    </el-form>

    <el-divider></el-divider>

    <div class="journal-list">
      <h3>历史记录</h3>
      <el-card v-for="(item, index) in journals" :key="index" class="journal-item" shadow="hover">
        <div class="date">{{ formatDate(item.date) }}</div>
        <div class="emotion-tag">
          <el-tag :type="getEmotionType(item.emotion)">{{ item.emotion }}</el-tag>
        </div>
        <div class="content">{{ item.content }}</div>
        <el-button type="danger" @click="deleteJournal(index)" icon="el-icon-delete">删除</el-button>
      </el-card>
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