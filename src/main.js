import Vue from 'vue'
import App from './App.vue'
import PortalVue from 'portal-vue'
import store from './vuex/store'
import VueSocketIO from 'vue-socket.io'


Vue.config.productionTip = false

Vue.use(PortalVue)
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.178.36:8084',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}
))
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
