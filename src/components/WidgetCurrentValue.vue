<template>
    <section  class="widget-socket">
      <div style="width:100%; height:70px" class="row">
        <div class="current-value-display">
            <div>
              <font-awesome-icon 
                icon="thermometer-quarter" 
                :style="{color: settings.plotColor !== undefined ? settings.plotColor.val : widgetSettings.plotColor.val}"
              />
            </div>
            <div>
              <span v-if="state != undefined">{{ state.val != undefined ? state.val : "N/A" }}</span>
              <span v-else> N/A </span>
            </div>
            <div>
              <font-awesome-icon v-if="trend" :icon="'chevron-' + trend" :class="trendClass" size="xs" />
            </div>
        </div>
      </div>
      <div v-if="settings.showHistory === undefined ? false : settings.showHistory.val" style="width:100%; height:calc(100% - 70px)">
        <chart-history :timeSpan="settings.timeSpan !== undefined ? settings.timeSpan.val : widgetSettings.timeSpan.val" 
          :objId="settings.objId != undefined ? settings.objId.val : widgetSettings.objId.val"
          :objState="state" 
          :plotColor="settings.plotColor !== undefined ? settings.plotColor.val : widgetSettings.plotColor.val"
        />
      </div>
    </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import ChartHistory from './ChartHistory'

export default {
  name: 'widget-current-value',
  components: {
    ChartHistory
  },
  props: ["settings"],
  mixins: [SubscriptionMixin, SettingsMergeMixin],
  data () {
    let widgetSettings = {
        objId: {
          val: "",
          component: "form-input",
          type: "text",
          category: "settings",
        },
        showHistory: {
           val: false,
           component: "form-checkbox",
           type: "checkbox",
           category: "history"
        },
        timeSpan: {
          val: 1,
          component: "form-select",
          type: "select",
          category: "history",
          options: [
            { value: 1, text: "Last hour" },
            { value: 24, text: "Last 24 hours" }
          ]
        },
        plotColor: {
          val: "#17a2b8",
          type: "color",
          component: "form-input",
          category: "history"
        }
        
    }

    return { 
      widgetSettings: widgetSettings, 
      trend: ""
    }
  },
  methods: {

  },
  watch: {
    "state": function(newState, oldState) {
      let trend = ""

      // no trend if no oldState is available or state is undefined
      if (oldState === undefined || newState === undefined) {
        return
      }
      
      const oldVal = oldState.val
      const newVal = newState.val

      // no trend for NaN values
      if (isNaN(parseFloat(newState.val))) {
        return
      }

      if (newVal < oldVal) {
        trend = "down"
      } else if (newVal === oldVal) {
        trend = "right"
      } else {
        trend = "up"
      }

      this.trend = trend
    }
  },
  computed: {
    state: function() {
      return this.updateValue(this.settings.objId)
    },
    trendClass: function() {
      let trendClass ="text-"
      
      switch (this.trend) {
        case "down":
          trendClass += "danger"
          break
        case "right":
          trendClass += "secondary"  
          break
        case "up":
          trendClass += "success"  
          break;
        default:
          trendClass = ""
      }
      return trendClass
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
  padding: 5px;
}
.current-value-display {
  display: flex;
  flex-flow: row;
  margin-top: auto;
  margin-left: 5px;
  margin-right: 5px;
}

.current-value-display > div {
  padding-left: 4px;
  padding-right: 4px;
} 
.current-value-icon {
    position: relative;
    top: calc(50% - 26px);
    /* color: #72a4d4; */
}
.current-value-display span {
  font-size: 2.5rem;
  text-align: right;
}
</style>