<template>
    <section  class="widget-socket">
    {{ val }}
    </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'



export default {
  name: 'widget-socket',
  components: {},
  props: ["settings"],
  mixins: [SubscriptionMixin, SettingsMergeMixin],
  data () {
    return {
      widgetSettings: {
        objId: {
          val: "",
          type: "input"
        },
      },
    }
  },
  mounted () {
  },
  methods: {
 
  },
  computed: {
    val: function() {
      return this.updateValue(this.settings.objId)
    } 
  },
  created() {
    let vm = this;
    vm.$nextTick(function() {
      vm.subscribe(vm.settings.objId.val)

      vm.$watch('settings.objId.val', function(newVal, oldVal) {
        vm.unsubscribe(oldVal)
        vm.subscribe(newVal)
      })
    })
  },
  destroyed() {
    this.unsubscribe(this.settings.objId.val)
  },
}

</script>

<style>

</style>