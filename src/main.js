import Vue from 'vue'

import Cookies from 'js-cookie'


import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/promission.js'
import App from './App'
import store from './store'
import './icons'
import router from './router'
import axios from 'axios'
import Axios from 'axios';

Vue.prototype.axios = axios
Axios.defaults.baseURL="/api"
window.bus = new Vue();

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
