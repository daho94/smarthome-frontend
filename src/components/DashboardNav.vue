<template>
    <section class="dashboard-nav">
        <b-list-group class="no-bg">
            <b-list-group-item v-for="dashboard in dashboards" v-bind:key="dashboard.id" class="no-bg cursor-pointer">
                 <router-link 
                 tag="i" 
                class="material-icons dashboard-icon dashboard-hover md-36"
                :to="{ name: 'dashboard', params: { dashboardId: dashboard.id}}"
                active-class="dashboard-active"
                exact-active-class
                >
                    dashboard
                </router-link>
            </b-list-group-item>
        </b-list-group>
    </section>
</template>

<script>
export default {
  components: {},
  props: ["dashboards"],
  data () {
    return {

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
.cursor-pointer:hover {
    color: grey;
}
.cursor-pointer {
    cursor: pointer;
}
.no-bg {
    background: none !important;
}
.dashboard-active {
    color: green;
}
</style>