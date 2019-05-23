import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'widget-settings-bar',
  components: {},
  props: ["settings", "widgetId"],
  data () {
    return {
      settingsCopy: cloneDeep(this.settings),
      settingsChanged: false,
    }
  },
  computed: {

  },
  watch: {
    settingsCopy: {
      handler() {
        this.settingsChanged = true;
      },
      deep: true,
    },
  },
  mounted () {
  },
  methods: {
    remove() {
      this.$parent.$emit("remove", this.widgetId)
    },
    confirm() {
      this.$parent.$emit("update", this.widgetId, cloneDeep(this.settingsCopy))
      this.settingsChanged = false
    },
    cancel() {
      this.settingsCopy = cloneDeep(this.settings)

      this.$nextTick(function() {
        this.settingsChanged = false
      })
    }
  }
}
