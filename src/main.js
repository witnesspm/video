import Vue from "vue";
import VueBus from 'vue-bus'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import './views/css/popoverclass.css'

Vue.use(ElementUI);
Vue.use(VueBus);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
}).$mount("#app");

