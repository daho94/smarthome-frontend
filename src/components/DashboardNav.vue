<template>
    <section class="dashboard-nav">
        <h1>dashboard-menu Component</h1>
        <ul>
            <router-link  
                tag="li" 
                v-for="dashboard in dashboards" v-bind:key="dashboard.id"
                :to="{ name: 'dashboard', params: { dashboardId: dashboard.id}}"
                active-class="dashboard-active"
                exact-active-class
                >
                {{ dashboard.name }}
                </router-link>
        </ul>
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
.dashboard-nav {

}
.dashboard-active {
    background-color: green;
}
</style>