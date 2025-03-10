// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import {store} from './store/store'
import axios from './js/common/axios'
import jqxGrid from './js/common/jqx.grid'
import hightchart from './js/common/highcharts'
import util from './js/common/util'
import D3Topology from './js/common/d3map/topology'

Vue.config.productionTip = false
Vue.use(axios)
Vue.use(jqxGrid)
Vue.use(hightchart)
Vue.use(util)
Vue.use(D3Topology)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

//공통 CSS
 require('@/assets/css/topo.css');
 require('@/assets/css/common.css');
 require('@/assets/css/main.css');
 require('@/assets/css/theme.blue.css');
 require('@/assets/css/theme.dark.css');
 require('@/assets/css/theme.white.css');
 require('@/assets/css/login.css');
 require('@/assets/css/highchart.hamon.css');
 require('@/assets/css/highchart.blue.css');
require('@/assets/css/highchart.dark.css');
 require('@/assets/css/highchart.white.css');

 require('@/assets/css/d3.css');
 require('@/assets/css/jqx.hamon.css');
 require('@/assets/css/jqx.popup.css');

 require('@/assets/styles/jqwidgets/jqx.dark.css');
 //require('@/assets/styles/jqwidgets/jqx.black.css');
 //require('@/assets/styles/jqwidgets/jqx.darkblue.css');
 //require('@/assets/styles/jqwidgets/jqx.shinyblack.css');
 require('@/assets/styles/jqwidgets/jqx.metrodark.css');
