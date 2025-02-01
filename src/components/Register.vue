<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit">
      <!-- 用户名输入 -->
      <div class="form-group">
        <label>用户名</label>
        <input
          type="text"
          v-model.trim="username"
          :class="{ 'input-error': errors.username }"
          @input="clearError('username')"
        />
        <div v-if="errors.username" class="error-message">
          {{ errors.username }}
        </div>
      </div>

      <!-- 密码输入 -->
      <div class="form-group">
        <label>密码</label>
        <input
          type="password"
          v-model.trim="password"
          :class="{ 'input-error': errors.password }"
          @input="clearError('password')"
        />
        <div v-if="errors.password" class="error-message">
          {{ errors.password }}
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="isSubmitting || hasErrors"
      >
        {{ isSubmitting ? "提交中..." : "立即注册" }}
      </button>

      <!-- 全局错误提示 -->
      <div v-if="globalError" class="global-error">
        {{ globalError }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 定义组件事件
const emit = defineEmits(["submit"]);

// 响应式数据
const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errors = ref({
  username: "",
  password: "",
});
const globalError = ref("");

// 计算是否有错误
const hasErrors = computed(() => {
  return Object.values(errors.value).some((error) => error !== "");
});

// 清除错误信息
const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
    globalError.value = "";
  }
};

// 表单验证规则
const validateForm = () => {
  let isValid = true;

  // 用户名验证
  if (!username.value) {
    errors.value.username = "用户名不能为空";
    isValid = false;
  } else if (username.value.length < 4) {
    errors.value.username = "用户名至少4个字符";
    isValid = false;
  }

  // 密码验证
  if (!password.value) {
    errors.value.password = "密码不能为空";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = "密码长度不能少于6位";
    isValid = false;
  }

  return isValid;
};

// 提交处理
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // 触发提交事件并传递数据
    await emit("submit", {
      username: username.value,
      password: password.value,
    });

    // 可选的自动重置表单
    // username.value = "";
    // password.value = "";
  } catch (error) {
    // 接收父组件传递的错误信息
    globalError.value =
      error.message || "注册失败，请检查网络连接后重试";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.register-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  margin-right: 30px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-error {
  border-color: #e74c3c;
}

.input-error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.8;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  height: 1.25rem;
}

.global-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
}
</style>