<template>
    <section class="dashboard-nav">
        <ul class="list-group flex-column no-bg">
            <li v-for="dashboard in dashboards" 
                v-bind:key="dashboard.id" 
                v-bind:class="{'dashboard-nav-expanded': showById === dashboard.id}" 
                class="no-bg  list-group-item dashboard-nav-border"
                @mouseover="showById = dashboard.id"
                @mouseleave="showById = null"
            >
                 <router-link 
                 tag="i" 
                class="cursor-pointer material-icons dashboard-icon dashboard-hover"
                :to="{ name: 'dashboard', params: { dashboardId: dashboard.id}}"
                active-class="text-info"
                exact-active-class

                >dashboard
                </router-link>
                <span v-if="showById === dashboard.id" class="ml-2 align-middle">{{ dashboard.name }}</span>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
  components: {},
  props: ["dashboards"],
  data () {
    return {
        showById:null,
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    changeDashboard(dashboardId) {
      this.$emit("changeDashboard", dashboardId)
    }
  }
}

</script>

<style>
.dashboard-nav-border {
    border: none !important;
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0.25rem;
}

.cursor-pointer {
    cursor: pointer;
}
.no-bg {
    background: none !important;
}

.dashboard-nav ul {
    padding-top: 2rem;
}

.dashboard-nav li {
    padding-left: 1.125rem;
}

.dashboard-nav ul>li>span {
    position: relative;
    bottom: 5px;
    font-size: 18px;
}

.dashboard-nav-expanded {
    width: 13rem;
    background-color: #2d2d2f !important;
    z-index: 10;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
 }
</style>