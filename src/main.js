// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 1. 引入reset.css文件
import "./assets/css/reset.css"

// 2. 安装vuex, 引入,挂到根实例上
import store from "./store"

// 3. 数据交互 http.js
// 4. 过滤器
import "./filters"

// 5. 公共组件
import "./components"
// 6.路由
// 7.element-ui 引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //挂到根实例上
  components: { App },
  template: '<App/>'
})
