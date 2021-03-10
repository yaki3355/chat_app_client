import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import socket from './socket';

Vue.config.productionTip = false
Vue.prototype.$socket = socket;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
