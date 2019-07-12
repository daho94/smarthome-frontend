<template>
    <section class="widget-current-value">
      <div style="width:100%; height:70px" class="row">
        <div class="current-value-display">
            <div>
              <squid-icon v-if="settings.icon && settings.icon.val.length > 0"
                :icon="loadSetting('icon')"
                :style="{
                  stroke: loadSetting('titleColor'),
                  fill: loadSetting('titleColor')
                }"
                class="current-value-icon"
              />
            </div>
            <div>
              <span class="current-value" v-if="state != undefined">{{ valueToDisplay[0] }}</span>
              <span class="current-value" v-else> N/A </span>
            </div>
            <div >
              <span class="decimals text-secondary">
                {{ valueToDisplay[1] }}
                <span class="unit"> {{ loadSetting('unit') }}</span>
              </span>
            </div>  
            <div>
              <font-awesome-icon v-if="trend" :trend="trend" :icon="'chevron-' + trend"  class="trend-icon" size="xs" />
            </div>
        </div>
      </div>
      <div v-if="loadSetting('showHistory')" style="width:100%; height:calc(100% - 70px)">
        <chart-history :timeSpan="loadSetting('timeSpan')" 
          :objId="loadSetting('objId')"
          :objState="state" 
          :plotColor="loadSetting('plotColor')"
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
          category: "settings"
        },
        unit: {
          val: "",
          component: "form-input",
          tye: "text",
          category: "settings"
        },
        icon: {
          val: "",
          component: "form-icon",
          type: "text",
          category: "settings"
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
    state(newState, oldState) {
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
    valueToDisplay() {
      if (this.state === undefined) {
        return ["",""]
      }

      if (isNaN(this.state.val)) {
        return [this.state.val, ""]
      }

      const splitted = this.state.val.toString().split(".")
      return [splitted[0], "," + (splitted[1] | 0)]
    },
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
  mounted() {
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

<style lang="scss">
.widget-current-value {
  flex-flow: column;
}
.widget-current-value > div {
  width: 100%;
  padding: 5px;
}
.current-value-display {
  display: flex;
  flex-flow: row;
  margin-top: auto;
  margin-left: 5px;
  margin-right: 5px;
  height: 100%;
}
.current-value-display div {
  height: 100%;
}

.current-value-display div:first-child {
  padding-left: 4px;
  padding-right: 8px;
} 
.current-value-display div:last-child {
    padding-left: 8px;
    padding-right: 4px;
}
.current-value-icon {
    height: 80% !important;
}
.current-value {
  font-size: 2.5rem;
  text-align: right;
  position: relative;
  top: 5px;
}
.unit {
  position: absolute;
  font-size: 14px;
  top: -18px;
  left: calc(100% - 10px);
}
.decimals {
  position: relative;
  font-size: 30px;
  top: 5px;
}
.trend-icon {
  position: relative;
  top: 5px;
  height: 25px;
}
.trend-icon {
  &[trend="up"] {
    color: $success-color;
  }
  &[trend="down"] {
    color: $danger-color;
  }
  &[trend="right"] {
    color: $secondary-color;
  }
}

</style>