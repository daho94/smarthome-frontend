<template>
  <div class="container-fluid">
    <div class="row">
      <div class="border-right border-bottom nav-row">
      </div>
      <div class="border-bottom dashboard-row">
        <section class="dashboard-header">
            <b-navbar toggleable="lg" type="dark" class="bg-app z-index-10">
              <b-navbar-brand>{{ dashboardName }}</b-navbar-brand>

              <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

              <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                  <calendar-component/>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 text-white edit-btn" :class="{'edit-active': isEditLayout}" v-on:click="isEditLayout = !isEditLayout">
                    <i class="material-icons">create</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0  text-white edit-btn" v-bind:disabled="!isEditLayout" v-on:click="saveDashboard">
                    <i class="material-icons">save</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 text-white edit-btn" v-bind:disabled="!isEditLayout" v-on:click="restoreDashboard">
                    <i class="material-icons">clear</i>
                  </b-button>               
                </b-navbar-nav>
              </b-collapse>
            </b-navbar>
        </section>
      </div>
    </div>
    <div class="row dashboard-content">
      <div class="border-right nav-row">
        <dashboard-nav :dashboards="dashboards" @changeDashboard="changeDashboard"/>
      </div>
      <div class="dashboard-row">
        <dashboard-content 
        :layout="layout" 
        :isEditLayout="isEditLayout"
        @removeWidget="removeWidget"
        @updateSettings="updateSettings"
        />
      </div>
    </div>
      <portal v-if="isEditLayout" to="settings-bar" >
            <widget-library 
              :layout="layout"
              @addWidget="addWidget"
            />
      </portal>
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
import CalendarComponent from '../components/CalendarComponent'

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
    CalendarComponent,
  },
  data() {
    return {
      layout: [],
      layoutBackup: [],
      isEditLayout: false,
      dashboards: [],
      dashboardName: '',
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
    this.loadDashboards()
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
        this.dashboardName = dashboard.name
        this.layoutBackup = cloneDeep(this.layout)
      })
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
.z-index-10 {
  z-index: 10;
}
.edit-active {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1);
  -moz-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1);
  box-shadow: 0px 0px 4px 0px rgba(235, 228, 235, 0.6);
}
.edit-btn {
  color: white;
}

.edit-btn:focus {
  outline: none !important;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1) !important;
  -moz-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1) !important;
  box-shadow: 0px 0px 4px 0px rgba(235, 228, 235, 0.6) !important;
}
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
.dashboard-header {
  height: 60px;
}
.boder-right {
  border-right: 1px solid #c3c0c087; 
}
.border-bottom {
  border-bottom: 1px solid #c3c0c087; 
}
.dashboard-content {
    height: calc(100% - 61px);
}
.dashboard-row {
  width: calc(100% - 61px);
}
.nav-row {
  width: 61px;
}
</style>
