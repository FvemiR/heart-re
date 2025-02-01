<template>
    <div class="container">
      <MapContainer class="map" />
    </div>
</template>
<script>
import MapContainer from '../components/MapContainer.vue'
export default {
    components:{
        MapContainer
    }
}

</script>
<style scoped>
.container {
  height: 300px; /* 占据全屏高度 */
}


</style>