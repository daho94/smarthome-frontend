<template>
    <section  class="widget-socket">
      <div style="width:100%; height:20%">
        {{ val }}
      </div>
      <div style="width:100%; height:80%">
        <chart-test :height="height" :width="width" />
      </div>
    </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import ChartTest from './ChartTest'


export default {
  name: 'widget-socket',
  components: {
    ChartTest
  },
  props: ["settings", "height", "width"],
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
.widget-socket {
  flex-flow: column;
  overflow: hidden;
}
.widget-socket>div {
  width: 100%;
  padding: 20px;
}
</style>