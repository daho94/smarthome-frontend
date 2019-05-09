export default {
  name: 'widget-settings-bar',
  components: {},
  props: ["settings", "widgetId"],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    remove() {
      this.$parent.$emit("remove", this.widgetId)
    }
  }
}
