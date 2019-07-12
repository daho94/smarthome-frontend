<template>
    <portal to="settings-bar">
        <section class="widget-settings">
            <h3>{{ categories[currentTab].name }}</h3>
            <b-button-group v-if="settingsChanged" vertical class="action-buttons">
              <b-button size="sm" variant="success" v-on:click="confirm"><i class="material-icons">check</i></b-button>
              <b-button size="sm" variant="danger" v-on:click="cancel"><i class="material-icons">restore</i></b-button>
            </b-button-group>

            <b-button-group vertical class="tab-buttons">
              <b-button
                v-for="(cat, i) in widgetCategories" 
                v-bind:key="i" 
                size="sm" 
                variant="transparent" 
                v-on:click="changeTab(cat)"
                :id="cat"
              >
                <i class="material-icons">{{ categories[cat].iconUrl }}</i>
                <b-tooltip :target="cat" placement="left">
                    {{ categories[cat].name }}
                </b-tooltip>
              </b-button>
            </b-button-group>

            <component  v-for="(setting, j) in settingsSorted[currentTab]" v-bind:key="j"
              class="form-margin"
              :model="setting" 
              :type="setting[1].type" 
              :is="setting[1].component">
            </component>
            <button class="remove-widget-btn" v-on:click="remove">Remove Widget</button>
        </section>
    </portal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import WidgetSettingsMixin from '../mixins/widget-settings-mixin'
import groupBy from 'lodash/groupBy'
import forEach from 'lodash/forEach'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormCheckbox from './FormCheckbox'
import FormIcon from './FormIcon'

export default {
  components: {
    FormInput,
    FormSelect,
    FormCheckbox,
    FormIcon,
  },
  mixins: [WidgetSettingsMixin],
  props: ["settings", "widgetId"],
  data () {
    return {
      settingsCopy: cloneDeep(this.settings),
      settingsChanged: false,
      currentTab: "basic",
    }
  },
  computed: {
    settingsSorted: function() {
      let array = []
      forEach(this.settingsCopy, function(value, key) {
        array.push([key, value])
      })

      let sorted = groupBy(array, function(value) {
        return value[1].category
      })
      return sorted
    },
    widgetCategories: function() {
      let cats = new Set()

      forEach(this.settingsCopy, function(value) {
        cats.add(value.category)
      })
      
      return Array.from(cats)
    }  
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
    },
    changeTab(category) {
      this.currentTab = category
    }
  }
}

</script>

<style lang="scss" scope>
.widget-settings {
    height: 100%;
    margin-left: 5px;
    margin-right: 15px;
}
.tab-buttons {
  position: absolute !important;
  left: -42px;
  top: 85px;
  background:$sidebar-background-color;
  button {
    color: $light-color;
  }    
}
.tab-buttons button:focus {
  outline: none;
  box-shadow: none;
}
.action-buttons {
  position: absolute !important;
  left: -42px;
  top: 0px;
  background: #47484f;
}
.action-buttons button {
  border-radius: 0px !important;
}
.remove-widget-btn {
  position: relative;
  bottom: 0;
  margin-top: 20px;
}
.form-margin {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>