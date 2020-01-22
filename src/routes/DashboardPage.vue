<template>
  <div class="container-fluid">
    <div class="row">
      <div class="bg-nav nav-left">
        <img src="/img/favicon-96x96.png">
      </div>
      <div class="bg-nav nav-right">
        <section class="dashboard-header">
            <b-navbar toggleable="lg"  class="bg-nav z-index-10">
              <b-navbar-brand>{{ currentDashboardInfo.name }}</b-navbar-brand>

              <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

              <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" :class="{'edit-active': isEditLayout}" v-on:click="isEditLayout = !isEditLayout">
                    <i class="material-icons">create</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0  nav-btn edit-btn" v-show="isEditLayout" v-on:click="saveDashboard">
                    <i class="material-icons">save</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" v-show="isEditLayout" v-on:click="restoreDashboard">
                    <i class="material-icons">clear</i>
                  </b-button>
                  <b-button size="sm" variant="transparent" class="my-2 my-sm-0 nav-btn edit-btn" v-on:click="$emit('themeChanged')">
                    <i class="material-icons">{{activeTheme === 'dark' ? 'brightness_3' : 'wb_sunny'}}</i>
                  </b-button>    
                  <b-nav-item-dropdown right no-caret toggle-class="custom-toggle" menu-class="custom-menu">
                    <i slot="button-content" class="material-icons">account_circle</i>
                    <b-dropdown-item v-b-modal.modal-create-dashboard>                  
                      <b-button size="sm" variant="transparent" class="my-2 my-sm-0 edit-btn add-btn"  >
                        <i class="material-icons">dashboard</i>
                      </b-button> 
                      Create Dashboard
                    </b-dropdown-item>                   
                    <b-dropdown-item  @click="deleteDashboard()">
                      <b-button size="sm" variant="transparent" class="my-2 my-sm-0 edit-btn add-btn">
                        <i class="material-icons">delete</i>
                      </b-button> 
                      Delete Dashboard
                    </b-dropdown-item>
                    <b-dropdown-item v-b-modal.modal-create-folder>                  
                      <b-button size="sm" variant="transparent" class="my-2 my-sm-0 edit-btn add-btn"  >
                        <i class="material-icons">folder</i>
                      </b-button> 
                      Create Folder
                    </b-dropdown-item>
                    <b-dropdown-item  @click="logout()">
                      <b-button size="sm" variant="transparent" class="my-2 my-sm-0 edit-btn add-btn">
                        <i class="material-icons">account_circle</i>
                      </b-button> 
                      Logout
                    </b-dropdown-item>
                  </b-nav-item-dropdown>
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
    <form-create-folder @on-submit="createFolder" />
  </div>
</template>

<script>
import DashboardContent from '../components/DashboardContent'
import cloneDeep from 'lodash/cloneDeep'
import { getDashboards, getDashboard, getDefaultDashboard, saveDashboard, createDashboard, deleteDashboard } from '../calls/dashboard'
import { createFolder } from '../calls/folder'
import { logout } from '../calls/auth'
import DashboardSidebarMenu from '../components/DashboardSidebarMenu'
import FormCreateDashboard from '../components/FormCreateDashboard'
import FormCreateFolder from '../components/FormCreateFolder'


export default {
  components: {
    DashboardContent,
    DashboardSidebarMenu,
    FormCreateDashboard,
    FormCreateFolder
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
      currentDashboardInfo: {
        name: "",
        id: undefined,
        isDefault: undefined,
      },
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
        vm.currentDashboardInfo.id = dashboard.id
        vm.currentDashboardInfo.name = dashboard.name
        vm.currentDashboardInfo.isDefault = dashboard.default_dashboard
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
      let success = await createDashboard(dashboard.name, dashboard.icon, this.dashboards.length === 0 ? true : false, dashboard.folderId)
      if(success) {
        // refresh dashboards
        this.loadDashboards()
      }
    },
    async createFolder(folder) {
      let success = await createFolder(folder)
      if(success) {
        // refresh dashboards
        this.loadDashboards()
      }
    },
    async deleteDashboard() {
      let vm = this

      // can't delete default dashboard
      if(this.currentDashboardInfo.isDefault) {
        return
      }

      let success = await deleteDashboard(this.currentDashboardInfo.id)
      if(success) {
        getDashboards().then(dashboards => {
          let defaultDashboard = dashboards.find(function(dashboard) {
            return dashboard.is_default
          })

          vm.$router.replace({ name: 'dashboard', params: { dashboardId: defaultDashboard.id }})

          vm.dashboards = dashboards
        })
      }
    },
    restoreDashboard() {
      this.layout = cloneDeep(this.layoutBackup)
      this.isEditLayout = false
    },
    async logout() {
      let success = await logout()
      if(success) {
        this.$router.push('login')
      }
    }
  }
}
</script>

<style lang="scss" >
.custom-toggle {
  padding-bottom: 0px !important;
  padding-right: 0px !important;
  padding-top: 5px !important;
  :focus {
    outline: none;
  }
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
  background-color: $navbar-background-color !important;  
  -webkit-box-shadow: 0px 2px 0px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 0px 0px rgba(0,0,0,0.75);
  box-shadow: 0px 2px 0px 0px rgba(0,0,0,0.75);
  z-index: 1000;
}
.nav-right {
  width: calc(100% - 50px);
}
.nav-left {
  width: 50px;
  img {
    height: auto;
    width: 50px;
    padding: 8px;
  }
}
.navbar-toggler-icon {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E") !important;
}
.navbar-light .navbar-nav .nav-link {
  color: $light-color !important;
}
.custom-menu:focus {
  outline: none !important;
}
.custom-menu {
  background-color: $navbar-background-color !important; 
  .dropdown-item, button {
    color: $light-color !important; 
  }
  .dropdown-item:hover {
    color: $light-color !important; 
    background-color: $sidebar-background-color !important;
  }
}
</style>
