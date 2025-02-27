<template>
  <div class="full-screen-container">
    <el-card class="user-info-card">
      <!-- 头像区域 -->
      <div class="avatar-container">
        <el-avatar 
          :size="130" 
          :src="userInfo.avatar_url" 
          class="user-avatar"
        />
      </div>

      <!-- 用户信息 -->
      <el-descriptions 
        class="margin-top"
        :title="greetingMessage"
        :column="1"
        border
      >
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ userInfo.school_name }}</el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          @click="openSchoolDialog"
          :loading="loading"
        >修改学校</el-button>
        <el-button 
          type="primary" 
          @click="passwordDialogVisible = true"
          :loading="loading"
        >修改密码</el-button>
      </div>
    </el-card>

    <!-- 修改学校对话框 -->
    <el-dialog title="修改学校" v-model="schoolDialogVisible" width="40%">
      <el-form
        ref="schoolFormRef"
        :model="editSchoolForm"
        :rules="schoolRules"
        label-width="100px"
      >
        <el-form-item label="选择学校" prop="school_id">
          <el-select
            v-model="editSchoolForm.school_id"
            placeholder="请选择学校"
            filterable
            class="full-width"
          >
            <el-option
              v-for="school in schoolList"
              :key="school.id"
              :label="school.name"
              :value="school.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="schoolDialogVisible = false">取消</el-button>
        <el-button 
          type="primary"
          @click="submitSchoolForm(schoolFormRef)"
          :loading="submitting"
        >确认</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" v-model="passwordDialogVisible" width="40%">
      <el-form
        ref="passwordFormRef"
        :model="editPasswordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="editPasswordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="editPasswordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button 
          type="primary"
          @click="submitPasswordForm(passwordFormRef)"
          :loading="submitting"
        >确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { get, patch } from '../util/request'

// 用户信息
const userInfo = reactive({
  id: null,
  username: '',
  school_name: '',
  avatar_url: ''
})

// 学校列表
const schoolList = ref([])
const loading = ref(false)
const submitting = ref(false)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true
    const res = await get('/api/users', { name: userInfo.username })
    if (res.data.results.length > 0) {
      Object.assign(userInfo, res.data.results[0])
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 获取学校列表
const fetchSchools = async () => {
  try {
    const res = await get('/api/users/school')
    schoolList.value = res.data
  } catch (error) {
    ElMessage.error('获取学校列表失败')
  }
}

// 问候语逻辑
const greetingMessage = computed(() => {
  const messages = [
    '欢迎回来！愿你拥有美好的一天🌞',
    '很高兴见到你！一起开启新的旅程吧🚀',
    '你好！今天也是充满希望的一天✨'
  ]
  return `${userInfo.username}，${messages[Math.floor(Math.random() * messages.length)]}`
})

// 学校修改相关
const schoolFormRef = ref(null)
const schoolDialogVisible = ref(false)
const editSchoolForm = reactive({ school_id: null })

const openSchoolDialog = async () => {
  await fetchSchools()
  editSchoolForm.school_id = schoolList.value.find(s => s.name === userInfo.school_name)?.id
  schoolDialogVisible.value = true
}

const submitSchoolForm = async (formEl) => {
  if (!formEl) return
  try {
    submitting.value = true
    await formEl.validate()
    await patch('/api/users', {
      id: userInfo.id,
      school_id: editSchoolForm.school_id
    })
    
    const selectedSchool = schoolList.value.find(s => s.id === editSchoolForm.school_id)
    userInfo.school_name = selectedSchool.name
    ElMessage.success('学校信息更新成功')
    schoolDialogVisible.value = false
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 密码修改相关
const passwordFormRef = ref(null)
const passwordDialogVisible = ref(false)
const editPasswordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const validatePassword = (rule, value, callback) => {
  if (value !== editPasswordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = reactive({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
})

const submitPasswordForm = async (formEl) => {
  if (!formEl) return
  try {
    submitting.value = true
    await formEl.validate()
    await patch('/api/users/password', {
      id: userInfo.id,
      password: editPasswordForm.newPassword
    })
    
    ElMessage.success('密码修改成功')
    passwordDialogVisible.value = false
    editPasswordForm.newPassword = ''
    editPasswordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '修改失败')
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(() => {
  userInfo.username = sessionStorage.getItem('username') || '用户'
  fetchUserInfo()
})
</script>

<style scoped>
.full-screen-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.user-info-card {
  width: 600px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.user-avatar {
  border: 2px solid #eee;
}

.margin-top {
  margin-top: 20px;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.full-width {
  width: 100%;
}

.el-descriptions__title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

.el-descriptions-item__label {
  font-weight: 500;
}
</style>