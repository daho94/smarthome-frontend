<template>
  <div>   
    <section class="header-bar">
      header-bar Component
      <button class="header-button button-kek" v-on:click="openDashboardMenu">Dashboards</button>
      <button class="header-button button-left" v-on:click="isEditLayout = !isEditLayout">Edit</button>
      <button v-if="isEditLayout" class="header-button button-lefter" v-on:click="saveDashboard">Save</button>
      <portal v-if="isEditLayout" to="settings-bar" >
        <widget-library 
          :layout="layout"
          @addWidget="addWidget"
        />
      </portal>
      <portal v-if="isDashboardMenu" to="dashboard-menu">
        <dashboard-menu
          :dashboards="dashboards"
          @changeDashboard="changeDashboard"
        />
      </portal>
    </section>
    <AppContent 
      :layout="layout" 
      :isEditLayout="isEditLayout"
      :isDashboardMenu="isDashboardMenu"
      @removeWidget="removeWidget"
      />
  </div>
</template>

<script>
import AppContent from '../components/app-content'
import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import WidgetLibrary from '../components/widget-library'
import DashboardMenu from '../components/dashboard-menu'
import uuidv4 from 'uuid/v4'
import { getDashboards, getDashboard, getDefaultDashboard, saveDashboard } from '../calls/dashboard'

let baseSettings = {
  title: {
    val: "Default title",
    type: "input"
  },
  showTitle: {
    val: true,
    type: "checkbox"
  }
}

// var testLayout = [
//   {"x":0,"y":0,"w":2,"h":2,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
//   {"x":2,"y":0,"w":2,"h":4,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
//   {"x":4,"y":0,"w":2,"h":5,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
// ]

export default {
  name: 'home',
  components: {
    AppContent,
    WidgetLibrary,
    DashboardMenu,
  },
  data() {
    return {
      layout: [],
      isEditLayout: false,
      isDashboardMenu: false,
      dashboards: [],
    }
  },
  created: function() {
    let self = this;
    let dashboardId = this.$route.params.dashboardId;
    if (!dashboardId) {
      getDefaultDashboard().then(dashboard => {
        this.$router.replace({ name: 'dashboard', params: { dashboardId: dashboard.id }})
      })
    } else {
      this.changeDashboard(parseInt(dashboardId))
    }

    getDashboards().then(dashboards => {
      self.dashboards = dashboards
    })
  },
  watch: {
    '$route' (to, _from) {
      this.changeDashboard(parseInt(to.params.dashboardId))
    }
  },
  computed: {
  },
  methods: {
    addWidget: function(component) {
      let wLowest = maxBy(this.layout, w => w.y + w.h)
      this.layout.push(
        {"x":0,"y":wLowest.y+ wLowest.h,"w":2,"h":2,"i":uuidv4(),"c": component, "settings": cloneDeep(baseSettings)},
      )
    },
    removeWidget(id) {
      this.layout = this.layout.filter(item => item.i != id)
    },
    changeDashboard(id) {
      getDashboard(id).then(dashboard => {
        this.layout = dashboard.settings
      })
    },
    openDashboardMenu() {
      let menuOpen = this.isDashboardMenu;
      if (!menuOpen) {
        this.loadDashboards()
      }
      this.isDashboardMenu = !menuOpen
    },
    loadDashboards() {
      getDashboards().then(dashboards => {
        this.dashboards = dashboards
      })
    },
    saveDashboard() {
      let self = this
      saveDashboard(parseInt(this.$route.params.dashboardId), this.layout).then(success => {
        if(success) {
          self.isEditLayout = false
        }
      })
    }
  }
}
</script>

<style>

.header-button {
  position: absolute;
  top: calc(30px - 10px);
}
.button-kek {
  left: 0%;
}
.button-left {
  left: 10%;
}
.button-lefter {
  left: 20%;
}
.header-bar {
  height: 60px;
  background-color: aquamarine;
}
</style>
