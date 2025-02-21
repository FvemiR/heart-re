<template>
    <div class="full-screen-container">
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card">
        <!-- 头像 -->
        <el-avatar 
          :size="130" 
          :src="avatarUrl" 
          class="user-avatar"
        ></el-avatar>
  
        <!-- 动态生成的问候语作为标题 -->
        <el-descriptions 
          class="margin-top" 
          :title="greetingMessage" 
          :column="1" 
          border
        >
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="学校">{{ userInfo.school }}</el-descriptions-item>
        </el-descriptions>
  
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="schoolDialogVisible = true">修改学校</el-button>
          <el-button type="primary" @click="passwordDialogVisible = true">修改密码</el-button>
        </div>
      </el-card>
  
      <!-- 修改学校对话框 -->
      <el-dialog 
        title="修改学校" 
        v-model="schoolDialogVisible"
        width="30%"
      >
        <el-form 
          ref="schoolFormRef"
          :model="editSchoolForm"
          :rules="schoolRules"
          label-width="80px"
        >
          <el-form-item label="新学校" prop="newSchool">
            <el-input v-model="editSchoolForm.newSchool" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="schoolDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitSchoolForm(schoolFormRef)">提交</el-button>
          </span>
        </template>
      </el-dialog>
  
      <!-- 修改密码对话框 -->
      <el-dialog 
        title="修改密码" 
        v-model="passwordDialogVisible"
        width="30%"
      >
        <el-form 
          ref="passwordFormRef"
          :model="editPasswordForm"
          :rules="passwordRules"
          label-width="80px"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input 
              v-model="editPasswordForm.oldPassword" 
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="editPasswordForm.newPassword" 
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="editPasswordForm.confirmPassword" 
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="passwordDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitPasswordForm(passwordFormRef)">提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  
  // 定义问候语逻辑
  const greetingMessage = computed(() => {
    const warmMessages = [
      '欢迎回来！希望你今天过得愉快。',
      '很高兴再次见到你！愿你的每一天都充满阳光。',
      '你好！让我们一起创造更美好的明天吧！'
    ];
    const randomIndex = Math.floor(Math.random() * warmMessages.length);
    return `Hi ${userInfo.username}, ${warmMessages[randomIndex]}`;
  });
  
  const schoolFormRef = ref(null);
  const passwordFormRef = ref(null);
  
  const schoolDialogVisible = ref(false);
  const passwordDialogVisible = ref(false);
  
  const userInfo = reactive({
    username: 'exampleUser',
    school: 'Example University'
  });
  
  const avatarUrl = '';
  
  const editSchoolForm = reactive({
    newSchool: ''
  });
  
  const equalToPassword = (rule, value, callback) => {
    if (value !== editPasswordForm.newPassword) {
      callback(new Error("两次输入的密码不一致"));
    } else {
      callback();
    }
  };
  
  const editPasswordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const schoolRules = reactive({
    newSchool: [
      { required: true, message: '请输入新的学校名称', trigger: 'blur' }
    ]
  });
  
  const passwordRules = reactive({
    oldPassword: [
      { required: true, message: '请输入旧密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 16, message: '长度应在6到16个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入您的密码', trigger: 'blur' },
      { validator: equalToPassword, trigger: 'blur' }
    ]
  });
  
  const submitSchoolForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
      if (valid) {
        userInfo.school = editSchoolForm.newSchool;
        ElMessage.success('学校信息修改成功');
        schoolDialogVisible.value = false;
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };
  
  const submitPasswordForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
      if (valid) {
        ElMessage.success('密码修改成功');
        passwordDialogVisible.value = false;
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };
  </script>
  
  <style scoped>
  .full-screen-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .user-info-card {
    width: 80%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .user-avatar {
    float: left;
    margin-right: 20px;
  }
  
  .margin-top {
    margin-top: 100px;
  }
  
  .action-buttons {
    margin-top: 20px;
    text-align: right;
  }

  /* 放大问候语 */
  .el-descriptions__title {
    font-size: 40px; 
  }
  </style>



