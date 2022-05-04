<template>
  <div id="app">
         <el-row>
      <First></First>
    </el-row>
      <router-view />
  </div>
</template>
<script>
import First from "./components/First.vue";
export default {

  components:{
   First,
  }
}
</script>



<style> 
 #app {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
