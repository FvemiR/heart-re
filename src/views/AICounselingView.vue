<template>
  <div class="counseling-container">
    <el-card shadow="always" style="width: 100%; margin-bottom: 20px;">
      <h3>智能AI心理辅导师</h3>
      <el-button type="primary" @click="fetchIpccInfo">获取AI辅导师信息</el-button>
      <pre>{{ ipccInfo }}</pre>
    </el-card>

    <el-card shadow="always" style="width: 100%; margin-bottom: 20px;">
      <h3>申请专家辅导</h3>
      <el-form :model="counselingForm" label-width="120px">
        <el-form-item label="学生ID">
          <el-input v-model.number="counselingForm.student_id"></el-input>
        </el-form-item>
        <el-form-item label="辅导师ID">
          <el-input v-model.number="counselingForm.counselor_id"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="counselingForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="applyForCounseling">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" style="width: 100%;">
      <h3>更新辅导状态</h3>
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="辅导记录ID">
          <el-input v-model.number="updateForm.id"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="updateForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="0"></el-option>
            <el-option label="处理中" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="updateCounselingStatus">更新状态</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
//import * as apiService from ''; // 替换为实际路径

export default {
  setup() {
    const ipccInfo = ref({});
    const counselingForm = ref({
      student_id: '',
      counselor_id: '',
      description: ''
    });
    const updateForm = ref({
      id: '',
      status: ''
    });

    const fetchIpccInfo = async () => {
      try {
        const response = await apiService.get('/api/counseling/ipcc');
        ipccInfo.value = response.data;
        ElMessage.success('获取成功');
      } catch (error) {
        ElMessage.error('获取失败');
      }
    };

    const applyForCounseling = async () => {
      try {
        const response = await apiService.post('/api/counseling/counsuling', counselingForm.value);
        ElMessage.success('申请成功');
        console.log(response);
      } catch (error) {
        ElMessage.error('申请失败');
      }
    };

    const updateCounselingStatus = async () => {
      try {
        const response = await apiService.patch('/api/counseling/counsuling', updateForm.value);
        ElMessage.success('更新成功');
        console.log(response);
      } catch (error) {
        ElMessage.error('更新失败');
      }
    };

    return {
      ipccInfo,
      counselingForm,
      updateForm,
      fetchIpccInfo,
      applyForCounseling,
      updateCounselingStatus
    };
  }
};
</script>

<style scoped>
.counseling-container {
  padding: 20px;
}
</style>



