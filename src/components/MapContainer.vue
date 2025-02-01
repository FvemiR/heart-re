<template>
  <div class="map-container">
    <nav class="map-header">
      <div class="search-wrapper">
        <input id="tipinput" placeholder="搜索地点..." />
        <input id="endinput" placeholder="输入你要到的地方">
        <button id="addButton" @click="addWaypoint">添加途经点</button>
        <button id="saveButton">开始规划路线</button>
      </div>
      <div
        v-for="(waypoint, index) in waypoints" 
        :key="waypoint.id"
        class="waypoint-item"
      >
        <input 
          :placeholder="`途经点 ${index + 1}`"
          v-model="waypoint.value"
          :ref="el => initAutocomplete(el, waypoint.id)"
        >
        <button @click="removeWaypoint(waypoint.id)">×</button>
      </div>
    </nav>
    <div id="container"></div>
    <div id="route"></div>
  </div>
</template>
//样式的一些处理
<style scoped>
.waypoint-item {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  max-width: 800px;
  margin: 8px auto 0;
}

.waypoint-item input {
  flex: 1;
  padding: 8px 15px;
  border: 1px solid #e4e4e4;
  border-radius: 20px;
}

.waypoint-item button {
  background: #ff4444;
  color: white;
  border: none;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
}
.map-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-header {
  background: #fff;
  padding: 12px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.search-wrapper {
  max-width: 800px;  /* 增加最大宽度 */
  margin: 0 auto;
  display: flex;      /* 新增Flex布局 */
  gap: 16px;         /* 输入框间距 */
  width: 100%;
}
#tipinput,
#endinput {
  flex: 1;           /* 等分剩余空间 */ 
  padding: 12px 20px;
  border: 1px solid #e4e4e4;
  border-radius: 28px;
  font-size: 16px;
  transition: all 0.3s;
}/*两个输入框的处理*/
#container {
  flex: 1;
  height: calc(100vh - 60px);
}
#route {
        position: fixed;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 150px;
        right: 10px;
        width: 280px;
      }
</style>

<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {ref} from "vue";
let map = null;
let startPoint = "";
let endPoint = "";
//添加途经点部分
// 途经点存储数组（核心数据）
const waypoints = ref([]);
let uid = 0;

// 添加途经点
const addWaypoint = () => {
  waypoints.value.push({
    id: uid++,
    value: ""
  });
};

// 删除途经点
const removeWaypoint = (id) => {
  waypoints.value = waypoints.value.filter(wp => wp.id !== id);
};

// 自动完成初始化（每个输入框单独绑定）
const initAutocomplete = (el, id) => {
  if (!el) return;
  
  AMap.plugin(['AMap.AutoComplete'], () => {
    new AMap.AutoComplete({ input: el });
  });
};
//添加途经点部分
onMounted(() => {
window._AMapSecurityConfig = {
  securityJsCode: "3d09a082a01eea42adf1decd9fa795d6",
};
AMapLoader.load({
  key: "3824907cffc0ba4801265f86da93b934", // 申请好的Web端开发者Key，首次调用 load 时必填
  version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins: ["AMap.Scale","AMap.ToolBar","AMap.PlaceSearch","AMap.AutoComplete","AMap.Driving"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
})
  .then((AMap) => {
    map = new AMap.Map("container", {
      // 设置地图容器id
      viewMode: "3D", // 是否为3D地图模式
      zoom: 15, // 初始化地图级别
      center: [116.397428, 39.90923], // 初始化地图中心点位置
    });
    var driving = new AMap.Driving({
        map: map,
        panel: "route"
    }); 
    var toolbar = new AMap.ToolBar(); //创建工具条插件实例
    map.addControl(toolbar); //添加工具条插件到页面
    //第一个输入框搜索联想处理
    var autoOptions = {
      input: "tipinput"
    };
    AMap.plugin(['AMap.PlaceSearch','AMap.AutoComplete'], function(){
      var auto = new AMap.AutoComplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
          map: map
      });  //构造地点查询类
      auto.on("select", function(e){
          placeSearch.search(e.poi.name);
      });//注册监听，当选中某条记录时会触发
  });
  //第二个搜索框搜索联想处理
  var autoOptions1 = {
      input: "endinput"
    };
    AMap.plugin(['AMap.PlaceSearch','AMap.AutoComplete'], function(){
      var auto = new AMap.AutoComplete(autoOptions1);
      var placeSearch = new AMap.PlaceSearch({
          map: map
      });  //构造地点查询类
      auto.on("select", function(e){
          placeSearch.search(e.poi.name);
      });//注册监听，当选中某条记录时会触发
  });
  //注册监听器，当点击开始规划是获取两个输入框的值
  document.getElementById("saveButton").addEventListener("click", () => {
  // 获取两个输入框的值
  startPoint = document.getElementById("tipinput").value;  //起点输入框
  endPoint = document.getElementById("endinput").value;  //终点输入框
  console.log("起点:", startPoint, "终点:", endPoint);  //控制台打印两个输入框的值
  if(startPoint&&endPoint)
  {  
    const viaPoints = waypoints.value
      .map(wp => ({ keyword: wp.value.trim(), city: '' }))
      .filter(wp => wp.keyword !== '');  //过滤掉空格并转换格式

    // 构造路径规划参数数组
    const searchPoints = [
      { keyword: startPoint, city: '' },
      ...viaPoints, // 插入所有途经点
      { keyword: endPoint, city: '' }
    ];
      driving.search(searchPoints,function(status, result) {
      // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
      if (status === 'complete') {
          log.success('绘制驾车路线完成')
      } else {
          log.error('获取驾车数据失败：' + result)
      }
    });
  }
  else
  {
    alert('请输入完整的起点与终点')
  }
    })
})
  .catch((e) => {
    console.log(e);
  });
});

onUnmounted(() => {
map?.destroy();
});
</script>



