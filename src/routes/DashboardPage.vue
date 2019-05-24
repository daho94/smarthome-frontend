<template>
  <div>   
    <section class="header-bar">
      header-bar Component
      <button v-if="!isEditLayout" class="header-button button-kek" v-on:click="openDashboardMenu">Dashboards</button>
      <button class="header-button button-left" v-on:click="isEditLayout = !isEditLayout">Edit</button>
      <button v-if="isEditLayout" class="header-button button-lefter" v-on:click="saveDashboard">Save</button>
      <button v-if="isEditLayout" v-on:click="restoreDashboard">Cancel</button>
      <portal v-if="isEditLayout" to="settings-bar" >
        <widget-library 
          :layout="layout"
          @addWidget="addWidget"
        />
      </portal>
      <portal v-if="isDashboardMenu" to="dashboard-menu">
        <dashboard-nav
          :dashboards="dashboards"
          @changeDashboard="changeDashboard"
        />
      </portal>
    </section>
    <dashboard-content 
      :layout="layout" 
      :isEditLayout="isEditLayout"
      :isDashboardMenu="isDashboardMenu"
      @removeWidget="removeWidget"
      @updateSettings="updateSettings"
      />
  </div>
</template>

<script>
import DashboardContent from '../components/DashboardContent'
import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import WidgetLibrary from '../components/WidgetLibrary'
import DashboardNav from '../components/DashboardNav'
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

export default {
  // name: 'dashboard',
  components: {
    DashboardContent,
    WidgetLibrary,
    DashboardNav,
  },
  data() {
    return {
      layout: [],
      layoutBackup: [],
      isEditLayout: false,
      isDashboardMenu: false,
      dashboards: [],
    }
  },
  created: function() {
    let dashboardId = this.$route.params.dashboardId;
    if (!dashboardId) {
      getDefaultDashboard().then(dashboard => {
        this.$router.replace({ name: 'dashboard', params: { dashboardId: dashboard.id }})
      })
    } else {
      this.changeDashboard(parseInt(dashboardId))
    }
  },
  watch: {
    '$route' (to) {
      this.changeDashboard(parseInt(to.params.dashboardId))
    }
  },
  computed: {
  },
  methods: {
    addWidget: function(component) {
      let wLowest = maxBy(this.layout, w => w.y + w.h)
      // if dashboard is empty...
      if (!wLowest) {
        wLowest = {
          y: 0,
          h: 0,
        }  
      }
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
        this.layoutBackup = cloneDeep(this.layout)
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
    },
    restoreDashboard() {
      this.layout = cloneDeep(this.layoutBackup)
      this.isEditLayout = false
    },
    updateSettings(id, settings) {
      let widget = this.layout.filter(item => item.i === id)[0]
      widget.settings = settings
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
