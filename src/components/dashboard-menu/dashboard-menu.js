export default {
  name: 'dashboard-menu',
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
