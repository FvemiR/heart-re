<template>
  <el-form ref="pwdRef" :model="form" :rules="rules" label-width="80px">
    <!-- 保留新密码和确认密码输入 -->
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineProps, ref } from "vue";
import requestUtil from "@/util/request";
import { ElMessage } from "element-plus";

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
    required: true
  }
});

// 表单数据只需包含 id 和密码字段
const form = ref({
  id: props.user.id, // 直接从 props 获取用户 id
  newPassword: "",
  confirmPassword: ""
});

const pwdRef = ref(null);

// 密码一致性验证规则
const equalToPassword = (rule, value, callback) => {
  if (form.value.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

// 验证规则配置
const rules = ref({
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { validator: equalToPassword, trigger: "blur" }
  ]
});

// 提交处理
const handleSubmit = () => {
  pwdRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构造符合接口文档的数据结构
        const postData = {
          id: form.value.id, // 直接使用已存在的用户 ID
          password: form.value.newPassword
        };

        const result = await requestUtil.post("user/updateUserPwd", postData);
        
        if (result.data.code === 200) {
          ElMessage.success("密码修改成功，下一次登录生效！");
          // 清空敏感字段
          form.value.newPassword = "";
          form.value.confirmPassword = "";
        } else {
          ElMessage.error(result.data.errorInfo);
        }
      } catch (error) {
        ElMessage.error("请求发送失败，请检查网络连接");
      }
    }
  });
};
</script>