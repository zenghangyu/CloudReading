// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios);


// import vueResource from 'vue-resource'; //与后端数据交互
//
// Vue.use(vueResource);

// Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  /*components: { App },
  template: '<App/>'*/
  render: h => h(App)
})
/*
Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = true;*/
axios.defaults.withCredentials=true
