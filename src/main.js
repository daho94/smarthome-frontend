import Vue from 'vue'
import App from './App.vue'
import PortalVue from 'portal-vue'
import store from './vuex/store'
import VueSocketIO from 'vue-socket.io'
import { router } from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VCalendar from 'v-calendar'
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize'

// FontAwesome 
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThermometerQuarter, faChevronUp, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faThermometerQuarter, faChevronUp, faChevronDown, faChevronRight)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(VueResize)

Vue.config.productionTip = false

Vue.use(VCalendar)
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