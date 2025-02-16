<template>
  <div class="home-container">
    <!-- 首页其他内容 -->

    
    <!-- 轮播图部分 -->
    <div class="carousel-container" 
         @mouseenter="pauseAutoPlay" 
         @mouseleave="resumeAutoPlay">
      <div class="carousel-track" :style="trackStyle">
        <div v-for="(slide, index) in slides" 
             :key="index" 
             class="carousel-slide">
          <img :src="slide.image" 
               alt="轮播图" 
               class="carousel-image" />
        </div>
      </div>

      <button class="carousel-btn prev" @click="prevSlide">‹</button>
      <button class="carousel-btn next" @click="nextSlide">›</button>

      <div class="pagination">
        <span v-for="n in slides.length" 
              :key="n" 
              :class="{ active: currentIndex === n-1 }"
              @click="goToSlide(n-1)"></span>
      </div>
    </div>
    <div class="home-content">
      <h2>欢迎来到心灵花园</h2>
      <p>您的心理健康成长平台</p>
    </div>
    <!-- 新增导航卡片 -->
    <div class="nav-card-container">
      <el-row :gutter="20">
        <el-col 
          v-for="(item, index) in navItems" 
          :key="index"
          :xs="12" :sm="8" :md="6" :lg="4">
          <el-card 
            class="nav-card"
            shadow="hover"
            @click="navigateTo(item.path)">
            <div class="card-content">
              <img :src="getIcon(item.name)" class="card-icon" />
              <div class="card-title">{{ item.name }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import p1 from '../assets/photo1.png'
import p2 from '../assets/photo2.png'
const router = useRouter();

// 轮播图数据
const slides = ref([
  { image:  p1},
  { image:  p2 },
  { image: 'https://picsum.photos/800/400?random=3' }
]);

// 导航项配置
const navItems = ref([
  { name: '首页', path: '/Home' },
  { name: '心理健康测试', path: '/mental-test' },
  { name: '心理社区活动', path: '/community' },
  { name: '心理健康知识科普', path: '/knowledge' },
  { name: 'AI心理辅导咨询', path: '/ai-counseling' },
  { name: '心情日记', path: '/mood-diary' }
]);

// 图标映射
const getIcon = (name) => {
  const icons = {
    '首页': 'https://img.icons8.com/color/96/000000/home.png',
    '心理健康测试': 'https://img.icons8.com/color/96/000000/test-passed.png',
    '心理社区活动': 'https://img.icons8.com/color/96/000000/conference.png',
    '心理健康知识科普': 'https://img.icons8.com/color/96/000000/book.png',
    'AI心理辅导咨询': 'https://img.icons8.com/color/96/000000/robot.png',
    '心情日记': 'https://img.icons8.com/color/96/000000/diary.png'
  };
  return icons[name] || 'https://img.icons8.com/color/96/000000/home.png';
};

// 导航跳转
const navigateTo = (path) => {
  router.push(path);
};

// 轮播图逻辑
const currentIndex = ref(0);
const autoPlayInterval = ref(null);

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`
}));

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    nextSlide();
  }, 3000);
};

const pauseAutoPlay = () => clearInterval(autoPlayInterval.value);
const resumeAutoPlay = () => startAutoPlay();

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

onMounted(startAutoPlay);
onBeforeUnmount(pauseAutoPlay);
</script>

<style scoped>
.home-container {
  padding-top: 100px;
  padding-bottom: 60px;
  background-color: #ffffff;
}

/* 轮播图样式 */
.carousel-container {
  position: relative;
  width: 100%;
  margin-top: -95px;
  overflow: hidden;
  border-radius: 1px;
  box-shadow: 0 px 16px rgba(0,0,0,0.1);
  background-color: white;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  flex: 0 0 100%;
  min-width: 100%;
}

.carousel-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
}

/* 控制按钮 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background 0.3s;
  border-radius: 50%;
}

.carousel-btn:hover {
  background: rgba(0,0,0,0.7);
}

.prev { left: 1rem; }
.next { right: 1rem; }

/* 分页指示器 */
.pagination {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.pagination span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.pagination span.active {
  background: white;
}

/* 首页内容样式 */
.home-content {
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
  padding: 20px;
}

.home-content h2 {
  color: #34495e;
  font-size: 4rem;
  margin-bottom: 1rem;
  font-family: "KaiTi", "STKaiti", serif;
}

.home-content p {
  color: #7f8c8d;
  font-size: 1.2rem;
  line-height: 1.6;
}

/* 导航卡片样式 */
.nav-card-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.nav-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 12px;
  background-color: white;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.card-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #34495e;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .carousel-image {
    height: 300px;
    border-radius: 12px 12px 0 0;
  }
  
  .home-content h2 {
    font-size: 2rem;
  }

  .card-icon {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 1rem;
  }
}
</style>