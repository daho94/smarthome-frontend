<template>
  <div class="container-fluid">
    <div class="row">
      <div class="dashboard-row bg-nav">
        <section class="dashboard-header">
            <b-navbar toggleable="lg"  class="bg-nav z-index-10">
              <b-navbar-brand>{{ dashboardName }}</b-navbar-brand>

              <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

              <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                  <calendar-component/>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" :class="{'edit-active': isEditLayout}" v-on:click="isEditLayout = !isEditLayout">
                    <i class="material-icons">create</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0  nav-btn edit-btn" v-bind:disabled="!isEditLayout" v-on:click="saveDashboard">
                    <i class="material-icons">save</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" v-bind:disabled="!isEditLayout" v-on:click="restoreDashboard">
                    <i class="material-icons">clear</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" v-on:click="$emit('themeChanged')">
                    <i class="material-icons">brightness_3</i>
                  </b-button>    
                  <div class="seperator" ></div>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn add-btn"  v-b-modal.modal-create-dashboard>
                    <i class="material-icons">add</i>
                  </b-button> 

                </b-navbar-nav>
              </b-collapse>
            </b-navbar>
        </section>
      </div>
    </div>
    <div class="row dashboard-content">
      <div class="dashboard-row">
        <dashboard-content 
        :layout="layout" 
        :activeTheme="activeTheme"
        :isEditLayout="isEditLayout"
        @layoutChanged="layoutChangedEvent"
        />
      </div>
    </div>
    <dashboard-sidebar-menu :dashboards="dashboards" />
    <form-create-dashboard @on-submit="createDashboard" />
  </div>
</template>

<script>
import DashboardContent from '../components/DashboardContent'
import cloneDeep from 'lodash/cloneDeep'
import { getDashboards, getDashboard, getDefaultDashboard, saveDashboard, createDashboard } from '../calls/dashboard'
import CalendarComponent from '../components/CalendarComponent'
import DashboardSidebarMenu from '../components/DashboardSidebarMenu'
import FormCreateDashboard from '../components/FormCreateDashboard'

export default {
  components: {
    DashboardContent,
    CalendarComponent,
    DashboardSidebarMenu,
    FormCreateDashboard,
  },
  props: {
    activeTheme: String
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
    changeDashboard(id) {
      let vm = this;
      getDashboard(id).then(dashboard => {
        vm.layout = dashboard.settings
        vm.dashboardName = dashboard.name
        vm.layoutBackup = cloneDeep(vm.layout)
      })
    },
    loadDashboards() {
      getDashboards().then(dashboards => {
        this.dashboards = dashboards
      })
    },
    layoutChangedEvent(newLayout) {
      this.newLayout = newLayout
    },
    saveDashboard() {
      let self = this
      saveDashboard(parseInt(this.$route.params.dashboardId), this.newLayout).then(success => {
        if(success) {
          self.isEditLayout = false
        }
      })
    },
    async createDashboard(dashboard) {
      let success = await createDashboard(dashboard.name, dashboard.icon)
      if(success) {
        // refresh dashboards
        this.loadDashboards()
      }
    },
    restoreDashboard() {
      this.layout = cloneDeep(this.layoutBackup)
      this.isEditLayout = false
    },
  }
}
</script>

<style lang="scss" >
.seperator {
  border-left: 1px solid $secondary-color;
  height: auto;
}
.z-index-10 {
  z-index: 10;
}
.edit-active {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1);
  -moz-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1);
  box-shadow: 0px 0px 4px 0px rgba(235, 228, 235, 0.6);
}

.nav-btn {
  color: $light-color !important;
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
.dashboard-header {
  height: $navbar-height;
}
.border-layout-right {
  @include themify($themes) {
    border-right: 1px solid themed('layoutBorderColor');  
  }
}
.border-layout-bottom {
  @include themify($themes) {
    border-bottom: 1px solid themed('layoutBorderColor');  
  }
}
.dashboard-content {
  min-height: calc(100vh - #{$navbar-height});
}
.dashboard-row {
  width: 100vw;
  padding-left: $sidebar-width;
}
.nav-row {
  width: 60px;
}
.navbar-brand {
  color: $light-color !important;
}
.navbar {
  padding: 5px 1rem !important;
}
.bg-nav {
  background-color: $sidebar-background-color !important;  
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E") !important;
}
</style>
