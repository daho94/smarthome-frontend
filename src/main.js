import Vue from 'vue'
import App from './App.vue'
import PortalVue from 'portal-vue'
import store from './vuex/store'
import VueSocketIO from 'vue-socket.io'
import { router } from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(PortalVue)
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://192.168.178.36:8449',
  vuex: {
    store,
    router,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}
))
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
