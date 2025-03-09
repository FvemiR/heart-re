<template>
  <div class="activity-page">
    <!-- 创建活动区域 -->
    <div class="create-section">
      <el-button type="primary" @click="showForm = true" size="large">
        <el-icon><Plus /></el-icon> 创建新活动
      </el-button>

      <transition name="el-zoom-in-top">
        <div v-if="showForm" class="activity-form">
          <el-input
            v-model="newActivity.name"
            placeholder="活动名称"
            clearable
            style="margin-bottom: 15px;"
          />
          <el-date-picker
            v-model="newActivity.time"
            type="datetime"
            placeholder="选择活动时间"
            format="YYYY/MM/DD HH:mm"
            value-format="x"
            style="margin-bottom: 15px;"
            class="full-width"
          />
          <div class="form-actions">
            <el-button @click="resetForm">取消</el-button>
            <el-button 
              type="success" 
              @click="showMap = true"
              :disabled="!newActivity.name || !newActivity.time"
            >
              开始路线规划
            </el-button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 地图规划区域 -->
    <transition name="el-zoom-in-top">
      <div v-if="showMap" class="map-section">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>路线规划 - {{ newActivity.name }}</span>
              <el-button type="info" @click="showMap = false" size="small">关闭</el-button>
            </div>
          </template>
          <MapContainer ref="mapComponent" />
          <div class="map-actions">
            <el-button type="primary" @click="saveActivity" size="large" :loading="saving">
              保存活动
            </el-button>
          </div>
        </el-card>
      </div>
    </transition>

    <!-- 活动卡片列表 -->
    <div class="activity-list">
      <el-row :gutter="20">
        <el-col 
          v-for="(activity, index) in activities" 
          :key="activity.id" 
          :xs="24" 
          :sm="12" 
          :md="8"
        >
          <el-card class="activity-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3 class="activity-title">{{ activity.name }}</h3>
                <el-tag type="info">{{ formatTime(activity.time) }}</el-tag>
              </div>
            </template>

            <div class="card-content">
              <div class="mini-map">
                <div class="map-preview" :id="'miniMap' + activity.id"></div>
                <el-divider direction="vertical" class="divider"/>
                <div class="route-info">
                  <el-scrollbar height="160px">
                    <div 
                      v-for="(point, i) in activity.routePoints" 
                      :key="i" 
                      class="route-point"
                    >
                      <el-icon :color="getPointColor(i, activity.routePoints.length)">
                        <component :is="getPointIcon(i, activity.routePoints.length)"/>
                      </el-icon>
                      <span class="point-text">{{ point }}</span>
                    </div> 
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Position, CircleCheck, Flag } from '@element-plus/icons-vue'
import MapContainer from '../components/MapContainer.vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const showForm = ref(false)
const showMap = ref(false)
const saving = ref(false)
const mapComponent = ref(null)
const activities = reactive([])
let miniMaps = []

const newActivity = reactive({
  id: 0,
  name: '',
  time: null,
  routePoints: []
})

// 重置表单
const resetForm = () => {
  showForm.value = false
  showMap.value = false
  newActivity.name = ''
  newActivity.time = null
  mapComponent.value?.clearRoute()
}

// 保存活动
const saveActivity = async () => {
  try {
    saving.value = true
    const routeInfo = mapComponent.value.getRouteInfo()
    
    if (routeInfo.points.length < 2) {
      ElMessage.error('请至少设置起点和终点')
      return
    }

    const activityId = Date.now()
    activities.unshift({
      id: activityId,
      ...newActivity,
      routePoints: [...routeInfo.points]
    })

    await nextTick()
    await initMiniMap(activityId)
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    resetForm()
    saving.value = false
  }
}

// 时间格式化
const formatTime = (timestamp) => {
  return new Date(Number(timestamp)).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 路线点样式
const getPointColor = (index, total) => {
  if (index === 0) return '#67C23A'
  if (index === total - 1) return '#F56C6C'
  return '#909399'
}

const getPointIcon = (index, total) => {
  if (index === 0) return Flag
  if (index === total - 1) return CircleCheck
  return Position
}

// 初始化小地图
const initMiniMap = async (activityId) => {
  try {
    const AMap = await AMapLoader.load({
      key: "3824907cffc0ba4801265f86da93b934",
      version: "2.0"
    })

    const activity = activities.find(a => a.id === activityId)
    if (!activity) return

    const map = new AMap.Map(`miniMap${activityId}`, {
      zoom: 13,
      viewMode: "2D",
      zoomEnable: false,
      interactive: false
    })

    new AMap.Driving().search(
      activity.routePoints.map(point => ({ keyword: point, city: "" })),
      (status, result) => {
        if (status === 'complete') {
          map.setFitView(result.routes[0].steps.flatMap(step => step.path))
        }
      }
    )

    miniMaps.push(map)
  } catch (error) {
    console.error('小地图初始化失败:', error)
  }
}

// 清理地图实例
onBeforeUnmount(() => {
  miniMaps.forEach(map => map.destroy())
  miniMaps = []
})
</script>

<style scoped>
/* 保持原有样式不变，增加以下优化 */
.activity-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.create-section {
  margin-bottom: 30px;
}

.activity-form {
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.map-section {
  margin: 20px 0;
}

.activity-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  height: 100%;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.mini-map {
  display: flex;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.map-preview {
  flex: 0 0 55%;
  min-height: 180px;
}

.route-point {
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 6px 0;
  background: rgba(245, 247, 250, 0.5);
  border-radius: 6px;
  transition: background 0.3s;
}

.route-point:hover {
  background: #ebedf0;
}

@media (max-width: 768px) {
  .mini-map {
    flex-direction: column;
    height: auto;
  }
  
  .map-preview {
    flex: none;
    height: 200px;
  }
  
  .divider {
    display: none;
  }
}
</style>