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

<style scoped>
/* 新增下拉面板样式 */
:deep(.amap-sug-result) {
  z-index: 2001 !important;
  position: absolute !important;
  top: 40px !important;
  left: 0 !important;
}

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
  position: relative;
}

.search-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  width: 100%;
  position: static;
}

#tipinput,
#endinput {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #e4e4e4;
  border-radius: 28px;
  font-size: 16px;
  transition: all 0.3s;
  position: relative;
  z-index: 1000;
}

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
  z-index: 998;
}
</style>

<script setup>
import { onMounted, onUnmounted, ref, defineExpose } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;
let AMapInstance = null;
let startPoint = "";
let endPoint = "";
let driving = null;

const waypoints = ref([]);
let uid = 0;

// 暴露方法给父组件
defineExpose({
  getRouteInfo: () => ({
    points: [startPoint, ...waypoints.value.map(wp => wp.value), endPoint].filter(Boolean)
  }),
  clearRoute: () => {
    if (driving) driving.clear();
    waypoints.value = [];
    startPoint = "";
    endPoint = "";
    document.getElementById('tipinput').value = '';
    document.getElementById('endinput').value = '';
  }
});

const addWaypoint = () => {
  waypoints.value.push({ id: uid++, value: "" });
};

const removeWaypoint = (id) => {
  waypoints.value = waypoints.value.filter(wp => wp.id !== id);
};

const initAutocomplete = (el, id) => {
  if (!el || !AMapInstance) return;
  
  AMapInstance.plugin(['AMap.AutoComplete'], () => {
    new AMapInstance.AutoComplete({ 
      input: el,
      //panel: 'tipinput' // 指定下拉面板容器
    });
  });
};

onMounted(() => {
  window._AMapSecurityConfig = { securityJsCode: "3d09a082a01eea42adf1decd9fa795d6" };
  
  AMapLoader.load({
    key: "3824907cffc0ba4801265f86da93b934",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.PlaceSearch", "AMap.AutoComplete", "AMap.Driving"]
  }).then((AMap) => {
    AMapInstance = AMap;
    map = new AMap.Map("container", {
      viewMode: "3D",
      zoom: 15,
      center: [116.397428, 39.90923],
    });

    var driving = new AMap.Driving({ map: map, panel: "route" });
    map.addControl(new AMap.ToolBar());

    // 初始化起点和终点输入框的自动完成
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

    document.getElementById("saveButton").addEventListener("click", () => {
      startPoint = document.getElementById("tipinput").value;
      endPoint = document.getElementById("endinput").value;
      
      if (startPoint && endPoint) {
        const searchPoints = [
          { keyword: startPoint, city: '' },
          ...waypoints.value.map(wp => ({ keyword: wp.value, city: '' })),
          { keyword: endPoint, city: '' }
        ].filter(p => p.keyword.trim());

        driving.search(searchPoints, (status) => {
          if (status !== 'complete') console.error('路线规划失败');
        });
      } else {
        alert('请输入起点和终点');
      }
    });
  });
});

onUnmounted(() => map?.destroy());
</script>