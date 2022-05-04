import Home from "@/views/Home.vue";

export default [
  {
    path: "/",
    name: "主页",
    meta: {
      title: '首页'
    },
  
    component: Home,
  },
  {
    path: "/video_face_recognition",
    name: "上传视频中检查表情",
    meta: {
      title: '视频检测'
    },
  
    component: () => import("@/views/VideoFaceRecognition.vue"),
  },
  {
    path: "/VideoLab",
    name: "观影实验室",
    meta: {
      title: '观影实验室'
    },
  
    component: () => import("@/views/VideoLab.vue"),
  },
  {
    path: "/手势识别",
    name: "shoushi",
    meta: {
      title: 'shoushi'
    },
    component: () => import("@/views/手势识别.vue"),
  },
  {
    path: "/语音识别",
    name: "yuyin",
    meta: {
      title: 'yuyin'
    },
    
  
    component: () => import("@/views/语音识别.vue"),
  },
  {
    path: "*",
    name: "",
    meta: {
      icon: "none",
      title: "任意异常",
    },
    component: Home,
  },
];
