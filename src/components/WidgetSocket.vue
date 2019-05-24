<template>
    <section  class="widget-socket">
    {{ temp }}
    </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'



export default {
  name: 'widget-socket',
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

</script>

<style>
.widget-socket {
    background-color: darkgray;
    height: 100%;
    width: 100%;
}
</style>