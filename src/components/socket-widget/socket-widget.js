import SubscriptionMixin from '../../mixins/subscription-mixin'
import SettingsMergeMixin from '../../mixins/settings-merge-mixin'



export default {
  name: 'socket-widget',
  components: {},
  props: [],
  mixins: [SubscriptionMixin, SettingsMergeMixin],
  data () {
    return {
      settings: {
        title: {
          val: "CPU Temp",
          type: "input"
        },
      },
      val: "",
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    temp: function() {
      return this.$store.state.subscriptions["rpi2.0.temperature.soc_temp"].val
    }
  },
  created () {
    this.subscribe('rpi2.0.temperature.soc_temp')
  },
  destroyed() {
    this.unsubscribe("rpi2.0.temperature.soc_temp")
  },
}
