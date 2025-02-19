<template>
  <div class="ai-dialog">
    <button class="close-btn" @click="$emit('close')">×</button>
    <!-- 消息展示区域 -->
    <div class="messages-container">
      <div 
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        {{ message.content }}
      </div>
      <div v-if="isLoading" class="loading">思考中...</div>
    </div>

    <!-- 用户输入区域 -->
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="输入你的问题..."
      />
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-0f6fcd8f5ed74305927cf84f25031ccb', // 请确保安全地管理您的API密钥
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  dangerouslyAllowBrowser: true,
});

const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  // 添加用户消息到列表
  messages.value.push({ role: 'user', content: userInput.value });
  const userQuestion = userInput.value;
  userInput.value = '';
  isLoading.value = true;

  try {
    const completion = await openai.chat.completions.create({
      model: "qwen-plus", // 根据实际情况选择模型
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userQuestion }
      ],
    });

    // 假设API响应结构包含assistant的消息内容
    const replyText = completion.choices[0].message.content;
    messages.value.push({ role: 'assistant', content: replyText });
  } catch (error) {
    console.error('调用通义千问失败:', error);
    messages.value.push({
      role: 'assistant',
      content: '抱歉，暂时无法处理您的请求'
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: #6c757d;
  font-size: 20px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #dc3545;
}

.ai-dialog {
  max-width: 600px;

  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
  background-color: #fff;
  font-family: 'Arial', sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative; /* 为关闭按钮定位提供参照 */
}

.messages-container {
  min-height: 500px;
  height: calc(100% - 120px); /* 动态计算高度 */
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(to bottom, #f9f9f9 0%, #e9ecef 100%);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.message {
  padding: 12px 16px;
  border-radius: 10px;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .05);
}

.message.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background-color: #dee2e6;
  color: #333;
}

.loading {
  text-align: center;
  color: #6c757d;
  padding: 10px;
}

.input-area {
  display: flex;
  padding: 16px;
  background-color: #f9f9f9;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

input {
  flex-grow: 1;
  padding: 12px;
  border: none;
  border-radius: 20px;
  margin-right: 12px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
  transition: box-shadow 0.2s ease-in-out;
}

input:focus {
  outline: none;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, .2);
}

button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ced4da;
  cursor: not-allowed;
}
</style>



