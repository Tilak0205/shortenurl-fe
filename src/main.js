import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

// Set up Axios with the base URL for your backend
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
Vue.prototype.$http = axios; // Make Axios available in all components via this.$http

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
