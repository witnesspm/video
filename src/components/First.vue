<template>
  <div  class="daohang">
    <el-col :span="24">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">用户名</template>
          <el-menu-item index="1-1">修改密码</el-menu-item>
          <el-menu-item index="1-2">退出登陆</el-menu-item>
        </el-submenu>
        <el-menu-item index="2">观影实验室</el-menu-item>
        <el-menu-item index="3">检查视频中人物表情</el-menu-item>
        <el-menu-item index="4">查看历史表情图表</el-menu-item>
      </el-menu></el-col
    >
  </div>
</template>
<script>
// 1、export 表示导出,在自定义组件里面使用export default导出
export default {
  // name 表示设置别名，可以不设置，建议和组件的名称一致
  name: "First",
  data() {
    return {
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.activeIndex=keyPath

      
      if (keyPath[1] == "1-2") {
        if(this.$router.history.current.name!="主页")
        this.$router.push({ name: "主页" });
      }
    
      if (key == 2) {
        if(this.$router.history.current.name!="观影实验室")
        this.$router.push({ name: "观影实验室" });
      }
        if (key == 3) {
        if(this.$router.history.current.name!="上传视频中检查表情")
        this.$router.push({ name: "上传视频中检查表情" });

      }
    },
  },
};
</script>
<style scoped>


</style>